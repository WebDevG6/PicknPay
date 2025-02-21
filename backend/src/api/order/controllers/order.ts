import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::order.order",
    ({ strapi }) => ({
        async countOrders(ctx) {
            try {
                const count =
                    await strapi.entityService.count("api::order.order");
                return ctx.send({ total: count });
            } catch (error) {
                ctx.throw(500, error);
            }
        },
    })
);
