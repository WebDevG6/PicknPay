export default {
    routes: [
        {
            method: "POST",
            path: "/order/getOrderDetail",
            handler: "order.getOrderDetail",
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};
