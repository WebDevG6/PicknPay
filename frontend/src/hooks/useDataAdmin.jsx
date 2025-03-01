import { useSuspenseQuery } from "@tanstack/react-query";
import conf from "@conf/main";
import ax from "@conf/ax";

// const fetchOrdersCount = async () => {
//     const response = await ax.get(conf.apiUrlPrefix + "/orders/count");
//     return response.data.total;
// };

const fetchProductsCount = async () => {
    const response = await ax.get(conf.apiUrlPrefix + "/products/count");
    return response.data.total;
};

const fetchCusCount = async () => {
    const response = await ax.get(conf.apiUrlPrefix + "/users/count-customers");
    return response.data.total;
};

const fetchCustomers = async () => {
    const response = await ax.get(`${conf.apiUrlPrefix}/users?filters[role][name][$eq]=Customer&populate=*`);
    return response.data;
};

const useDataAdmin = () => {
    // const { data: totalOrders = 0, error: ordersError, isLoading: ordersLoading } = useQuery({
    //     queryKey: ["ordersCount"],
    //     queryFn: fetchOrdersCount,
    // });

    const {
        data: totalProducts = 0,
        error: productsError,
        isLoading: productsLoading,
    } = useSuspenseQuery({
        queryKey: ["productsCount"],
        queryFn: fetchProductsCount,
    });

    const {
        data: totalCustomers = 0,
        error: cusError,
        isLoading: cusLoading,
    } = useSuspenseQuery({
        queryKey: ["cusCount"],
        queryFn: fetchCusCount,
    });

    const {
        data: customers = [],
        error: customersError,
        isLoading: customersLoading,
    } = useSuspenseQuery({
        queryKey: ["customers"],
        queryFn: fetchCustomers,
    });

    return {
        // totalOrders,
        totalProducts,
        totalCustomers,
        customers,
        // ordersLoading,
        productsLoading,
        cusLoading,
        customersLoading,
        // ordersError,
        productsError,
        cusError,
        customersError,
    };
};

export default useDataAdmin;
