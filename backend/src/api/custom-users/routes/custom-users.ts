export default {
    routes: [
        {
            method: "GET",
            path: "/users/count-customers",
            handler: "custom-users.count",
            config: {
                auth: false,
            },
        },
    ],
};
