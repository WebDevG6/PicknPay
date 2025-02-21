import React, { useRef } from "react";
import ProductCarousel from "../components/ProductCarousel";
import { useProductDetail } from "../hooks/query";
import { useParams } from "react-router-dom";
import { Spin, Rate, Button, InputNumber, notification } from "antd";
import { useAddItem } from "../hooks/service";

function Product() {
    const addItem = useAddItem();
    const { productId } = useParams();
    const { data: productDetail, isLoading, error } = useProductDetail(productId);
    const quantityRef = useRef(1);

    const [api, contextHolder] = notification.useNotification();
    const successNotification = () => {
        api.success({
            message: "เพิ่มสินค้าไปยังรถเข็นสำเร็จ",
            description: productDetail.name,
            duration: 3,
            placement: "bottomLeft",
        });
    };
    const errorNotification = () => {
        api.error({
            message: "เพิ่มสินค้าไปยังรถเข็นไม่สำเร็จ",
            description: productDetail.name,
            duration: 3,
            placement: "bottomLeft",
        });
    };

    const averageRating =
        productDetail?.reviews?.reduce((acc, review) => acc + review.rating, 0) / productDetail?.reviews?.length || 0;

    const handleAddItem = async () => {
        const quantity = quantityRef.current.value;
        await addItem.mutateAsync(
            { quantity: quantity, productId: productId },
            {
                onSuccess: () => {
                    successNotification();
                },
                onError: () => {
                    errorNotification();
                },
            }
        );
    };

    return (
        <div>
            {contextHolder}
            <div div className="bg-white rounded-md grid grid-cols-12 gap-6 p-6 z-0" >
                <div className="col-span-5">
                    <ProductCarousel images={productDetail.picture} />
                </div>
                <div className="col-span-7 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <p className="md:text-3xl text-2xl font-semibold">{productDetail.name}</p>
                        <div className="flex flex-row items-center gap-4 font-medium">
                            <div className="flex flex-row gap-2">
                                <p>{averageRating.toFixed(1)}</p>
                                <Rate disabled value={averageRating} />
                            </div>
                            <p>{productDetail?.reviews?.length} reviews</p>
                        </div>
                    </div>

                    <p className="text-2xl font-medium">฿ {Number(productDetail.price).toLocaleString("en-US")}</p>
                    <p className="whitespace-pre-line font-[Kanit] text-gray-700 text-lg">
                        {productDetail?.description}
                    </p>
                    <div className="flex flex-row items-center gap-4">
                        <p className="font-[Kanit] text-xl">จำนวน</p>
                        <InputNumber defaultValue={1} min={1} max={99} style={{ fontSize: 18 }} ref={quantityRef} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:pr-48 pr-0">
                        <Button
                            onClick={handleAddItem}
                            style={{
                                gridColumn: "span 1",
                                borderRadius: 6,
                                padding: 28,
                                fontFamily: "Kanit",
                                fontSize: 16,
                                fontWeight: 500,
                                background: "#C5D1F6",
                                borderColor: "#C5D1F6",
                                letterSpacing: 0.5,
                            }}
                        >
                            เพิ่มไปยังรถเข็น
                        </Button>
                        <Button
                            type="primary"
                            style={{
                                borderRadius: 6,
                                padding: 28,
                                fontWeight: 500,
                                fontFamily: "Kanit",
                                fontSize: 16,
                                gridColumn: "span 1",
                                letterSpacing: 0.5,
                            }}
                        >
                            ซื้อเลย
                        </Button>
                    </div>
                    <div className="flex flex-row gap-6 items-center">
                        <img src="http://localhost:1337/uploads/freeship_3471e12403.png" className="w-20 h-20" />
                        <div className="block font-[Kanit]">
                            <p className="font-semibold">Free shipping</p>
                            <p className="font-light">จัดส่งแบบมาตรฐาน ฟรี! เมื่อซื้อสินค้าครบ xxxx บาท</p>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default Product;
