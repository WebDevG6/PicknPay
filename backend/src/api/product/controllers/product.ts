/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::product.product",
    ({ strapi }) => ({
        async countProducts(ctx) {
            try {
                const count = await strapi.db
                    .query("api::product.product")
                    .count();
                return ctx.send({ total: count });
            } catch (error) {
                ctx.throw(500, error);
            }
        },
    })
);
