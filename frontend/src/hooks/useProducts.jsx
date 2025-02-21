import { useQuery } from "@tanstack/react-query";
import conf from "../conf/main";
import axios from "axios";



const fetchCategories = async () => {
    const response = await axios.get(conf.apiUrlPrefix + conf.categoriesEndpoint);
    return response.data.data;
};

const fetchProducts = async () => {
    const response = await axios.get(conf.apiUrlPrefix + conf.productsEndpoint + "?populate=*");
    return response.data.data;
};

const useProducts = () => {
    const { data: categories = [], error: categoriesError, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const { data: products = [], error: productsError, isLoading: productsLoading } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    return {
        categories,
        products,
        categoriesLoading,
        productsLoading,
        categoriesError,
        productsError,
    };
};

export default useProducts;