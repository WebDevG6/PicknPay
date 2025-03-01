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
};
