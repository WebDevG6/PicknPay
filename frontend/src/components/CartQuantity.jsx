import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";

const CartQuantity = () => {
    const { userInfo } = useContext(authContext);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        setQuantity(
            userInfo.cart_id.cart_items_id
                .map((item) => (item.isSelect ? Number(item.quantity) : 0))
                .reduce((a, b) => a + b)
        );
    }, [userInfo]);

    return <div>{quantity}</div>;
};

export default CartQuantity;
