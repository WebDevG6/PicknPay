export default {
    register() {},

    bootstrap({ strapi }: { strapi: any }) {
        strapi.db.lifecycles.subscribe({
            models: ["plugin::users-permissions.user"],

            async afterCreate(event) {
                const { result } = event;

                if (result && result.id) {
                    try {
                        await strapi.entityService.create("api::cart.cart", {
                            data: {
                                users_permissions_user: result.id,
                            },
                        });

                        strapi.log.info(`Cart created for user ${result.id}`);
                    } catch (error) {
                        strapi.log.error("Error creating cart:", error);
                    }
                }
            },
        });
    },
};
