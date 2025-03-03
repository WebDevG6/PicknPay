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
        const { order_items, couponId } = ctx.request.body;
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
                        unit_amount: (item.price - item.discountAmount) * 100,
                    },
                    quantity: product.quantity,
                };
            })
        );
        const value = line_items.reduce((acc, item) => acc + (item.price_data.unit_amount / 100) * item.quantity, 0);
        const shippingOptions =
            value < 600
                ? [
                      {
                          shipping_rate_data: {
                              type: "fixed_amount",
                              fixed_amount: {
                                  amount: 10000,
                                  currency: "thb",
                              },
                              display_name: "ค่าจัดส่ง 100 บาท",
                              delivery_estimate: {
                                  minimum: { unit: "business_day", value: 5 },
                                  maximum: { unit: "business_day", value: 7 },
                              },
                          },
                      },
                  ]
                : [
                      {
                          shipping_rate_data: {
                              type: "fixed_amount",
                              fixed_amount: {
                                  amount: 0,
                                  currency: "thb",
                              },
                              display_name: "จัดส่งฟรี",
                              delivery_estimate: {
                                  minimum: { unit: "business_day", value: 5 },
                                  maximum: { unit: "business_day", value: 7 },
                              },
                          },
                      },
                  ];
        try {
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/customer/order`,
                cancel_url: `${process.env.CLIENT_URL}/customer/cart`,
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
                shipping_options: shippingOptions,
                expires_at: Math.floor(Date.now() / 1000) + 1800,
                ...(couponId ? { discounts: [{ coupon: couponId }] } : { allow_promotion_codes: true }),
            });

            await strapi.service("api::order.order").create({
                data: {
                    order_items: await Promise.all(
                        order_items.map(async (item) => {
                            const product = await strapi
                                .service("api::product.product")
                                .findOne(item.productDocumentId, {
                                    populate: "*",
                                });
                            return {
                                product_id: item.productDocumentId,
                                quantity: item.quantity,
                                thumbnail: product.picture[0]?.url,
                                price: product.price - product.discountAmount,
                                deliveryCost: value < 600 ? 100 : 0,
                            };
                        })
                    ),
                    stripeId: session.id,
                    customer: ctx.state.user.id,
                    status_order: "processing",
                    value: line_items.reduce(
                        (acc, item) => acc + (item.price_data.unit_amount / 100) * item.quantity,
                        0
                    ),
                },
            });
            return { stripeSession: session };
        } catch (err) {
            console.error(err);
            ctx.response.status = 500;
            return err;
        }
    },
    async validateCoupon(ctx) {
        const { coupon } = ctx.request.body;

        if (!coupon) {
            return ctx.badRequest("Coupon code is required.");
        }

        try {
            const stripeCoupon = await stripe.coupons.retrieve(coupon);
            return ctx.send({
                valid: stripeCoupon.valid,
                id: stripeCoupon.id,
                amount_off: stripeCoupon.amount_off,
                percent_off: stripeCoupon.percent_off,
            });
        } catch (error) {
            return ctx.send({
                valid: false,
                message: "Invalid or expired coupon.",
            });
        }
    },
    async getOrderDetail(ctx) {
        const { orderDocumentId } = ctx.request.body;
        if (!orderDocumentId) {
            return ctx.badRequest("orderDocumentId is required.");
        }

        try {
            const order = await strapi.service("api::order.order").findOne(orderDocumentId);
            if (!order) {
                return ctx.notFound("Order not found.");
            }

            const orderDetail = await Promise.all(
                order.order_items.map(async (item) => {
                    const product = await strapi.service("api::product.product").findOne(item.product_id, {
                        populate: "picture",
                    });
                    return {
                        ...item,
                        productName: product.name,
                        productPrice: product.price,
                        productImageUrl: product.picture[0].formats.medium.url,
                        productId: product.id,
                    };
                })
            );

            return ctx.send({
                order: {
                    ...order,
                    order_items: orderDetail,
                },
            });
        } catch (err) {
            console.error(err);
            return ctx.internalServerError("An error occurred while retrieving the order.");
        }
    },
}));
