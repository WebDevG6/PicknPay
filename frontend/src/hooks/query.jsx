import ax from "../conf/ax";
import { useContext } from "react";
import conf from "../conf/main";
import { useMutation, useSuspenseQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import { authContext } from "../context/AuthContext";
import axios from "axios";

export function useCartItem() {
    const { userInfo } = useContext(authContext);
    return useSuspenseQuery({
        queryKey: ["cartItem"],
        queryFn: async () => {
            const response = await ax.get(conf.userGetCartItem(userInfo.cart_id.documentId));
            return response.data.data.map((item) => ({
                id: item.id,
                documentId: item.documentId,
                productName: item.product.name,
                price: Number(item.product.price),
                quantity: Number(item.quantity),
                isSelect: item.isSelect,
                imageUrl: conf.urlPrefix + item?.product?.picture[0]?.url,
                productId: item.product.id,
            }));
        },
    });
}

export function useUpdateCartItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ itemId, data }) => {
            const response = await ax.put(conf.updateCartItem(itemId), { data: data });
            return response.data;
        },
        onSettled: async (_, error) => {
            error ? console.log(error) : queryClient.invalidateQueries({ queryKey: ["cartItem"] });
        },
    });
}

export function useDeleteCartItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ itemId }) => {
            const response = await ax.delete(conf.updateCartItem(itemId));
            return response.data;
        },
        onSettled: async (_, error) => {
            error ? console.log(error) : queryClient.invalidateQueries({ queryKey: ["cartItem"] });
        },
    });
}

export function useProductDetail(productId) {
    return useSuspenseQuery({
        queryKey: ["productItem"],
        queryFn: async () => {
            const response = await ax.get(conf.getProductDetail(productId));
            return response.data.data[0];
        },
        enabled: !!productId,
    });
}

export const useReviews = () => {
    return useQuery({
        queryKey: ["reviews"], // ไม่มี id แล้ว เพราะดึงทั้งหมด
        queryFn: async () => {
            const response = await axios.get(`${conf.apiUrlPrefix}/reviews?populate=*`);
            return response.data.data;
        },
    });
};
