const urlPrefix = "http://localhost:1337";

const conf = {
    urlPrefix: urlPrefix,
    apiUrlPrefix: `${urlPrefix}/api`,
    loginEndpoint: "/auth/local",
    registerEndpoint: "/auth/local/register",
    jwtUserEndpoint:
        "/users/me?populate[role]=*&populate[cart_id][populate][cart_items_id][fields][0]=quantity&populate[cart_id][populate][cart_items_id][fields][1]=isSelect&populate[cart_id][populate][cart_items_id][populate][product][fields][0]=documentId",
    jwtSessionStorageKey: "auth.jwt",
    userEndpoint: "/users/",
    userGetCartItem: (cartId = "") =>
        `/cart-items?populate=cart_id&populate=product.picture&filters[cart_id][documentId]=${cartId}`,
    updateCartItem: (cartItemId = "") => `/cart-items/${cartItemId}`,
    getProductDetail: (productId = "") => `/products?filters[id][$eq]=${productId}&populate=*`,
    cartUrl: (cartId = "") => `/carts/${cartId}`,
    productsEndpoint: "/products",
    categoriesEndpoint: "/categories",
    reviewsEndpoint: "/reviews?populate=product.picture",
    orderEndpoint: (orderId = "") => `/orders/${orderId}`,
    validateCouponEndpoint: "validate-coupon",
};

export default conf;
