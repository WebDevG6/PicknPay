module.exports = {
    routes: [
        {
            method: "GET",
            path: "/coupons",
            handler: "coupon.couponList",
        },
    ],
};
