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
    async couponCreate(ctx) {
        const { couponDetail } = ctx.request.body;
        if (!couponDetail) {
            return ctx.badRequest("couponDetail is required.");
        }
        try {
            const coupon = await stripe.coupons.create({ ...couponDetail, name: couponDetail.id });
            return coupon;
        } catch (error) {
            ctx.response.status = 500;
            return { error: error.message };
        }
    },
};
