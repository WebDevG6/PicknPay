import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "plugin::users-permissions.user",
    ({ strapi }) => ({
        async count(ctx) {
            try {
                const count = await strapi.db
                    .query("plugin::users-permissions.user")
                    .count({
                        where: { role: { name: "Customer" } },
                    });
                return ctx.send({ total: count });
            } catch (error) {
                ctx.throw(500, error);
            }
        },
    })
);
