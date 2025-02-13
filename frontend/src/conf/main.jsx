const urlPrefix = "http://localhost:1337";

const conf = {
    urlPrefix: urlPrefix,
    apiUrlPrefix: `${urlPrefix}/api`,
    loginEndpoint: "/auth/local",
    registerEndpoint: "/auth/local/register",
    jwtUserEndpoint: "/users/me?populate[0]=cart_id.cart_items_id&populate[1]=role",
    jwtSessionStorageKey: "auth.jwt",
    userEndpoint: "/users/",
    userGetCartItem: (cartId = "") =>
        `/cart-items?populate=cart_id&populate=product.image&filters[cart_id][documentId]=${cartId}`,
    updateCartItem: (cartItemId = "") => `/cart-items/${cartItemId}`,
};

export default conf;
