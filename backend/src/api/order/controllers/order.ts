/**
 * order controller
 */

import { factories } from "@strapi/strapi";
const stripe = require("stripe")(process.env.STRIPE_KEY);

type order_items = {
    documentId: string;
    quantity: number;
    productDocumentId: string;
};

export default factories.createCoreController("api::order.order", ({ strapi }) => ({
    async create(ctx) {
        const { order_items } = ctx.request.body;
        const line_items = await Promise.all(
            order_items.map(async (product) => {
                const item = await strapi.service("api::product.product").findOne(product.productDocumentId);
                return {
                    price_data: {
                        currency: "thb",
                        product_data: {
                            name: item.name,
                            images: item.imageUrl,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: product.quantity,
                };
            })
        );
        try {
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}?success=true`,
                cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
                line_items: line_items,
                shipping_address_collection: { allowed_countries: ["TH"] },
                locale: "th",
                customer_email: ctx.state.user.email,
                metadata: {
                    products: JSON.stringify(
                        order_items.map((product) => ({
                            productDocumentId: product.productDocumentId,
                            productQuantity: product.quantity,
                        }))
                    ),
                    cartItems: JSON.stringify(
                        order_items.map((product) => ({
                            documentId: product.documentId,
                        }))
                    ),
                },
                expires_at: Math.floor(Date.now() / 1000) + 1800,
            });

            await strapi.service("api::order.order").create({
                data: {
                    order_items: order_items.map((item) => ({
                        product_id: item.productDocumentId,
                        quantity: item.quantity,
                    })),
                    stripeId: session.id,
                    customer: ctx.state.user.id,
                    status_order: "processing",
                },
            });
            return { stripeSession: session };
        } catch (err) {
            console.error(err);
            ctx.response.status = 500;
            return err;
        }
    },
}));
