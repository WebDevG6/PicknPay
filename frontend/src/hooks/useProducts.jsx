import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import conf from "@conf/main";
import ax from "@conf/ax";
import { message } from "antd";

const fetchCategories = async () => {
    const response = await ax.get(conf.apiUrlPrefix + conf.categoriesEndpoint);
    return response.data.data;
};

const fetchProducts = async () => {
    const response = await ax.get(conf.apiUrlPrefix + conf.productsEndpoint + "?populate=*");
    return response.data.data;
};

const useProducts = () => {
    const {
        data: categories = [],
        error: categoriesError,
        isLoading: categoriesLoading,
    } = useSuspenseQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const {
        data: products = [],
        error: productsError,
        isLoading: productsLoading,
    } = useSuspenseQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    const queryClient = useQueryClient();
    const refetchProducts = () => {
        queryClient.invalidateQueries(["products"]);
    };

    const deleteProductMutation = useMutation({
        mutationFn: async (documentId) => {
            await ax.delete(`${conf.apiUrlPrefix}${conf.productsEndpoint}/${documentId}`);
        },
        onSuccess: () => {
            message.success("ลบสินค้าสำเร็จ!");
            refetchProducts();
        },
        onError: (error) => {
            console.error("Error deleting product:", error);
            message.error("ไม่สามารถลบสินค้าได้!");
        },
    });

    const updateProductMutation = useMutation({
        mutationFn: async ({ documentId, productData }) => {
            await ax.put(`${conf.apiUrlPrefix}${conf.productsEndpoint}/${documentId}`, {
                data: productData,
            });
        },
        onSuccess: () => {
            refetchProducts();
        },
    });

    return {
        categories,
        products,
        categoriesLoading,
        productsLoading,
        categoriesError,
        productsError,
        deleteProduct: deleteProductMutation.mutate,
        updateProduct: updateProductMutation.mutate,
        refetchProducts,
    };
};

export default useProducts;
