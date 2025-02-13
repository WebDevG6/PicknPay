const conf = {
    apiUrlPrefix: "http://localhost:1337/api",
    loginEndpoint: "/auth/local",
    registerEndpoint: "/auth/local/register",
    jwtUserEndpoint: "/users/me?populate=*",
    jwtSessionStorageKey: "auth.jwt",
    userEndpoint: "/users/",
    userGetCartItem: (cartId = "") =>
        `/cart-items?populate=cart_id&populate=product&filters[cart_id][documentId]=${cartId}`,
    updateCartItem: (cartItemId = "") => `/cart-items/${cartItemId}`,
};

export default conf;
