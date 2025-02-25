import ax from "../conf/ax";
import { useContext } from "react";
import conf from "../conf/main";
import { useMutation } from "@tanstack/react-query";
import { authContext } from "../context/AuthContext";
import { useUpdateCartItem } from "../hooks/query";

export function useAddItem() {
    const { userInfo, updateUserInfo } = useContext(authContext);
    const updateCartItem = useUpdateCartItem();

    return useMutation({
        mutationFn: async ({ quantity, productId }) => {
            const isExist = userInfo.cart_id?.cart_items_id.filter(
                (item) => Number(item.product.id) === Number(productId)
            );
            if (isExist.length !== 0) {
                const itemId = isExist[0].documentId;
                const sumQuantity = Number(isExist[0].quantity) + Number(quantity);
                const totalQuantity = sumQuantity > 99 ? 99 : sumQuantity;
                await updateCartItem.mutateAsync({
                    itemId: itemId,
                    data: { isSelect: true, quantity: totalQuantity },
                });
                return { itemId, totalQuantity, isNew: false };
            } else {
                const response = await ax.post(conf.updateCartItem(), {
                    data: { quantity: quantity, cart_id: userInfo.cart_id.id, product: productId, isSelect: true },
                });
                const itemDocumentId = response.data.data.documentId;
                return { productId, quantity, itemDocumentId, isNew: true };
            }
        },
        onSettled: async (data, error) => {
            if (error) {
                console.log(error);
            } else {
                const { productId, quantity, itemDocumentId, itemId, totalQuantity, isNew } = data;
                updateUserInfo((prev) => ({
                    ...prev,
                    cart_id: {
                        ...prev.cart_id,
                        cart_items_id: isNew
                            ? [
                                  ...prev.cart_id.cart_items_id,
                                  { documentId: itemDocumentId, quantity, isSelect: true, product: { id: productId } },
                              ]
                            : prev.cart_id.cart_items_id.map((item) =>
                                  item.documentId === itemId
                                      ? { ...item, quantity: totalQuantity, isSelect: true }
                                      : item
                              ),
                    },
                }));
            }
        },
    });
}

export function useOrderUpdate() {
    return useMutation({
        mutationFn: async ({ orderId, status }) => {
            const response = await ax.put(conf.orderEndpoint(orderId), {
                data: { status_order: status },
            });
            return response.data.data;
        },
    });
}
