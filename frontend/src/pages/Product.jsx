import React from "react";
import ProductCarousel from "../components/ProductCarousel";
import { useProductDetail } from "../hooks/query";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

function Product() {
    const { productId } = useParams();
    const { data: productDetail, isLoading, error } = useProductDetail(productId);

    return (
        <Spin spinning={isLoading}>
            <div className="bg-white rounded-md grid grid-cols-12 gap-6 p-6">
                <div className="col-span-5">
                    <ProductCarousel images={productDetail.picture} />
                </div>
                <div className="bg-red-400 col-span-7">{productDetail.name}</div>
            </div>
        </Spin>
    );
}

export default Product;
