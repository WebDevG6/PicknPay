import ax from "../conf/ax";
import conf from "../conf/main";
import { useMutation } from "@tanstack/react-query";

export function useCouponCreate() {
    return useMutation({
        mutationFn: async ({ couponDetail }) => {
            const response = await ax.post(conf.couponCreateEndpoint, { couponDetail });
            return response.data.data;
        },
    });
}

export function useCouponDelete() {
    return useMutation({
        mutationFn: async ({ couponId }) => {
            const response = await ax.post(conf.couponDeleteEndpoint, { couponId });
            return response.data.data;
        },
    });
}
