export default {
    routes: [
        {
            method: "GET",
            path: "/orders/count",
            handler: "order.countOrders",
            config: {
                auth: false,
            },
        },
    ],
};
