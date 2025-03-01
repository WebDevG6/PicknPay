/**
 * coupon controller
 */

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY);

module.exports = {
    async couponList(ctx) {
        try {
            const response = await stripe.coupons.list();
            return response.data;
        } catch (error) {
            ctx.response.status = 500;
            return { error: error.message };
        }
    },
    async promotionList(ctx) {
        const { coupon } = ctx.request.body;
        if (!coupon) {
            ctx.response.status = 500;
        }
        try {
            const response = await stripe.promotionCodes.list({ coupon: coupon });
            return response.data;
        } catch (error) {
            ctx.response.status = 500;
            return { error: error.message };
        }
    },
    async getCouponDetail(ctx) {
        const { coupon } = ctx.request.body;
        if (!coupon) {
            ctx.response.status = 500;
        }
        try {
            const response = await stripe.coupons.retrieve(coupon);
            return response;
        } catch (error) {
            ctx.response.status = 500;
            return { error: error.message };
        }
    },
};
