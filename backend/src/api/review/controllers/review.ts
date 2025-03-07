/**
 * review controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::review.review", ({ strapi }) => ({
    async create(ctx) {
        try {
            const { data } = ctx.request.body;
            const user = ctx.state.user;

            if (!data) {
                return ctx.badRequest("Review content is required");
            }

            const response = await strapi.service("api::review.review").create({
                data: {
                    ...data,
                    user: user.id,
                    displayName: `${user.firstname} ${user.lastname}`,
                },
            });

            return ctx.created(response);
        } catch (error) {
            ctx.internalServerError("Internal Server Error");
        }
    },
}));
