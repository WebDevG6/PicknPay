import ax from "../conf/ax";
import conf from "../conf/main";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useOrderQuery() {
    return useSuspenseQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await ax.get(conf.orderEndpoint());
            return response.data.data;
        },
    });
}
