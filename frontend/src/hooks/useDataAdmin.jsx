import { useSuspenseQuery } from "@tanstack/react-query";
import conf from "@conf/main";
import ax from "@conf/ax";

const fetchOrders = async () => {
    const response = await ax.get(conf.orderEndpoint());
    const orders = response.data.data;
    const lenOrder = orders.length;
    const totalValue = orders.reduce((sum, order) => sum + (order.value || 0), 0);
    return {
        raw_orders: orders,
        summary: { lenOrder, totalValue },
        orders: orders.map((item) => ({ date: item.createdAt, value: item.value })),
    };
};

const fetchProductsCount = async () => {
    const response = await ax.get(conf.productCountEndpoint);
    return response.data.total;
};

const fetchCusCount = async () => {
    const response = await ax.get(conf.customerCountEndpoint);
    return response.data.total;
};

const fetchCustomers = async () => {
    const response = await ax.get(`${conf.userEndpoint}?filters[role][name][$eq]=Customer&populate=*`);
    return response.data;
};

const useDataAdmin = () => {
    const {
        data: orderSummary,
        error: ordersError,
        isLoading: ordersLoading,
    } = useSuspenseQuery({
        queryKey: ["ordersCount"],
        queryFn: fetchOrders,
    });

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
        orderSummary,
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
