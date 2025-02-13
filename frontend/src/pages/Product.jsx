import React from "react";
import ProductCarousel from "../components/ProductCarousel";
import { useProductDetail } from "../hooks/query";
import { useParams } from "react-router-dom";

function Product() {
    const { productId } = useParams();
    const { data: productDetail, isLoading, error } = useProductDetail(productId);

    return (
        <div className="bg-white rounded-md grid grid-cols-2 gap-4 p-4">
            <div className="col-span-1">
                <ProductCarousel />
            </div>
            <div className="bg-red-400 col-span-1">{productDetail.name}</div>
        </div>
    );
}

export default Product;
