module.exports = {
    routes: [
        {
            method: "GET",
            path: "/coupons",
            handler: "coupon.couponList",
        },
        {
            method: "POST",
            path: "/couponCreate",
            handler: "coupon.couponCreate",
        },
    ],
};
