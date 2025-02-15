import ax from "../conf/ax";
import { useContext } from "react";
import conf from "../conf/main";
import { useMutation } from "@tanstack/react-query";
import { authContext } from "../context/AuthContext";

export function useAddItem() {
    const { userInfo, updateUserInfo } = useContext(authContext);
    return useMutation({
        mutationFn: async ({ quantity, productId }) => {
            const response = await ax.post(conf.updateCartItem(), {
                data: { quantity: quantity, cart_id: userInfo.cart_id.id, product: productId, isSelect: true },
            });
            return response.data;
        },
        onSettled: async (data, error, variables) => {
            const { quantity } = variables;
            if (error) {
                console.log(error);
            } else {
                updateUserInfo((prev) => ({
                    ...prev,
                    cart_id: {
                        ...prev.cart_id,
                        cart_items_id: [...prev.cart_id.cart_items_id, { quantity: quantity, isSelect: true }],
                    },
                }));
            }
        },
    });
}
