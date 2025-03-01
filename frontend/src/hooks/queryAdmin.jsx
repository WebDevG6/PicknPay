import ax from "../conf/ax";
import conf from "../conf/main";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useOrderQuery() {
    return useSuspenseQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await ax.get(`${conf.orderEndpoint()}?populate=customer`);
            return response.data.data;
        },
    });
}

export function useCouponQuery() {
    return useSuspenseQuery({
        queryKey: ["coupons"],
        queryFn: async () => {
            const coupons = await ax.get(conf.conponListEndpoint);
            return coupons;
        },
    });
}
