/**
 * stripe-webhook.ts
 */

export default {
    routes: [
        {
            method: "POST",
            path: "/webhook/stripe",
            handler: "stripe.webhookHandler",
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: "POST",
            path: "/validate-coupon",
            handler: "order.validateCoupon",
            config: {
                auth: false,
            },
        },
    ],
};
