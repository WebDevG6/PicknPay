export default {
    routes: [
        {
            method: "GET",
            path: "/products/count",
            handler: "product.countProducts",
            config: {
                auth: false,
            },
        },
    ],
};
