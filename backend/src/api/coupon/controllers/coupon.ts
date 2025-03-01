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
            console.log(coupon);
            await stripe.promotionCodes.create({
                code: coupon.id,
                coupon: coupon.id,
            });
            return coupon;
        } catch (error) {
            ctx.response.status = 500;
            return { error: error.message };
        }
    },
    async couponDelete(ctx) {
        const { couponId } = ctx.request.body;
        if (!couponId) {
            return ctx.badRequest("couponId is required.");
        }
        try {
            const deleted = await stripe.coupons.del(couponId);
            return deleted;
        } catch (error) {
            ctx.response.status = 500;
            return { error: error.message };
        }
    },
};
