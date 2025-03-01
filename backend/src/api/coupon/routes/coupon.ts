module.exports = {
    routes: [
        {
            method: "GET",
            path: "/coupons",
            handler: "coupon.couponList",
        },
        {
            method: "POST",
            path: "/promotions",
            handler: "coupon.promotionList",
        },
    ],
};
