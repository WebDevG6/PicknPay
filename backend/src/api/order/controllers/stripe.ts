import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_KEY;
const STRIPE_WEBHOOK_KEY = process.env.STRIPE_WEBHOOK_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY);
const updatedProducts = new Set();

export default {
    async webhookHandler(ctx) {
        const signature = ctx.request.headers["stripe-signature"];
        const rawBody = ctx.request.body?.[Symbol.for("unparsedBody")];

        let event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_KEY);
        } catch (error) {
            console.error(`Webhook signature verification failed: ${error.message}`);
            return ctx.badRequest(`Webhook error: ${error.message}`);
        }

        const eventData = event.data.object;
        if (!eventData.metadata) {
            console.error("Metadata is missing from event data.");
            return ctx.badRequest("Metadata is missing.");
        }

        let products;
        let cartItems;
        try {
            products = JSON.parse(eventData.metadata.products || "[]");
            cartItems = JSON.parse(eventData.metadata.cartItems || "[]");
        } catch (error) {
            console.error("Failed to parse metadata products:", error);
            return ctx.badRequest("Invalid metadata format.");
        }

        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(eventData, products, cartItems);
                break;
            case "checkout.session.expired":
                await handleCheckoutSessionFailed(eventData);
                break;
            case "payment_intent.canceled":
                await handleCheckoutSessionFailed(eventData);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
                return ctx.send("Webhook received");
        }
    },
};

async function handleCheckoutSessionFailed(eventData) {
    const stripeId = eventData.id;
    try {
        await strapi.db.query("api::order.order").update({
            where: { stripeId },
            data: { status_order: "payment_failed" },
        });
    } catch (err) {
        console.log(err);
    }
}

async function handleCheckoutSessionCompleted(eventData, products, cartItems) {
    const stripeId = eventData.id;
    try {
        await strapi.db.query("api::order.order").update({
            where: { stripeId },
            data: { status_order: "succeeded" },
        });

        await updateStock(products);
        await Promise.all(cartItems.map((item) => deleteCustomerCartItem(item.documentId)));
    } catch (error) {
        console.error("Error processing checkout session completion:", error);
    }
}

async function updateStock(products) {
    for (const product of products) {
        if (updatedProducts.has(product.productDocumentId)) {
            continue;
        }

        try {
            const productDetail = await strapi.db.query("api::product.product").findOne({
                where: { documentId: product.productDocumentId },
            });

            if (productDetail) {
                const newStock = Math.max(0, productDetail.stock - product.productQuantity);
                await strapi.db.query("api::product.product").update({
                    where: { documentId: product.productDocumentId },
                    data: { stock: newStock },
                });

                updatedProducts.add(product.productDocumentId);
            }
        } catch (error) {
            console.error(`Error updating stock for product ${product.productDocumentId}:`, error);
        }
    }
}

async function deleteCustomerCartItem(cartItemId: string) {
    try {
        await strapi.db.query("api::cart-item.cart-item").delete({
            where: { documentId: cartItemId },
        });
    } catch (err) {
        console.log(err);
    }
}
