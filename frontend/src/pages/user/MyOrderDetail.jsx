import React from "react";
import { useParams } from "react-router-dom";
function MyOrderDetail() {
    const { orderId } = useParams();
    return <div>MyOrderDetail {orderId}</div>;
}

export default MyOrderDetail;
