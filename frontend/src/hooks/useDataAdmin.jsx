import { useQuery } from "@tanstack/react-query";
import conf from "../conf/main";
import axios from "axios";

const fetchOrdersCount = async () => {
    const response = await axios.get(conf.apiUrlPrefix + "/orders/count");
    return response.data.total;
};

const fetchProductsCount = async () => {
    const response = await axios.get(conf.apiUrlPrefix + "/products/count");
    return response.data.total;
};

const fetchCusCount = async () => {
    const response = await axios.get(conf.apiUrlPrefix + "/users/count-customers");
    return response.data.total;
};

const useDataAdmin = () => {
    const { data: totalOrders = 0, error: ordersError, isLoading: ordersLoading } = useQuery({
        queryKey: ["ordersCount"],
        queryFn: fetchOrdersCount,
    });

    const { data: totalProducts = 0, error: productsError, isLoading: productsLoading } = useQuery({
        queryKey: ["productsCount"],
        queryFn: fetchProductsCount,
    });

    const { data: totalCustomers = 0, error: cusError, isLoading: cusLoading } = useQuery({
        queryKey: ["cusCount"],
        queryFn: fetchCusCount,
    });

    return {
        totalOrders,
        totalProducts,
        totalCustomers,
        ordersLoading,
        productsLoading,
        cusLoading,
        ordersError,
        productsError,
        cusError,
    };
};

export default useDataAdmin;
