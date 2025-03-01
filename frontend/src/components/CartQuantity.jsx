import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";

const CartQuantity = () => {
    const { userInfo } = useContext(authContext);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        if (!userInfo.cart_id) {
            return;
        }
        if (userInfo.cart_id.cart_items_id.length !== 0) {
            setQuantity(
                userInfo.cart_id.cart_items_id
                    .map((item) => (item.isSelect ? Number(item.quantity) : 0))
                    .reduce((a, b) => a + b)
            );
        } else {
            setQuantity(0);
        }
    }, [userInfo]);

    return <div>{quantity}</div>;
};

export default CartQuantity;
