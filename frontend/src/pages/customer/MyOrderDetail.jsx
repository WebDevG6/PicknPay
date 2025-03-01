import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Steps } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    TruckOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import conf from "@conf/main";
import { useOrderDetail } from "@hooks/query";
import ReviewModal from "@components/user/ReviewModal";

function MyOrderDetail() {
    const orderDetail = useOrderDetail();
    const { orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        orderDetail.mutate({ orderId: orderId });
    }, [orderId]);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-2xl font-semibold tracking-wide font-[Kanit]">รายการคำสั่งซื้อ #{orderId}</p>
            </div>
            <div className="bg-white p-8 rounded-sm w-full flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                    <p className="text-lg font-[Kanit] font-semibold">วันที่สั่งซื้อ</p>
                    <p>{dayjs(orderDetail?.data?.order.createdAt).format("DD/MM/YYYY HH:mm:ss")}</p>
                </div>
                <div className="flex flex-col gap-6">
                    <p className="text-lg font-[Kanit] font-semibold">สถานะคำสั่งซื้อสินค้า</p>
                    <Steps
                        current={
                            orderDetail?.data?.order.status_order === "shipping"
                                ? 1
                                : orderDetail?.data?.order.status_order === "delivered"
                                ? 2
                                : 0
                        }
                        items={[
                            {
                                title:
                                    orderDetail?.data?.order.status_order === "processing"
                                        ? "กำลังดำเนินการชำระเงิน"
                                        : orderDetail?.data?.order.status_order === "payment_failed"
                                        ? "ชำระเงินล้มเหลว"
                                        : "ชำระเงินสำเร็จ",
                                icon:
                                    orderDetail?.data?.order.status_order === "processing" ? (
                                        <SyncOutlined spin />
                                    ) : orderDetail?.order?.status_order === "payment_failed" ? (
                                        <CloseCircleOutlined style={{ color: "#FF4D4F" }} />
                                    ) : (
                                        <WalletOutlined />
                                    ),
                            },
                            {
                                title: "อยู่ระหว่างจัดส่ง",
                                icon: <TruckOutlined />,
                            },
                            {
                                title: "จัดส่งสำเร็จ",
                                icon: <CheckCircleOutlined />,
                            },
                        ]}
                    />
                </div>
                <div className="flex flex-col gap-6">
                    <p className="text-lg font-[Kanit] font-semibold">รายละเอียดคำสั่งซื้อ</p>
                    <div className="flex flex-col gap-4">
                        {orderDetail?.data?.order.order_items.map((item) => (
                            <div className="flex flex-row gap-4 justify-between items-center pr-6" key={item.productId}>
                                <div className="flex flex-row gap-6 items-center ">
                                    <img
                                        src={conf.urlPrefix + item.productImageUrl}
                                        className="w-25 h-25 object-cover rounded-md"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-lg">{item.productName}</p>
                                        <p className="text-sm text-gray-500">
                                            จำนวน: {item.quantity} ชิ้น <br />฿
                                            {Number(item.productPrice).toLocaleString("en-US")}
                                        </p>
                                        <div className="flex flex-row gap-4">
                                            <p
                                                onClick={() => navigate(`/products/${item.productId}`)}
                                                className="text-xs text-gray-500 cursor-pointer hover:underline"
                                            >
                                                รายละเอียดเพิ่มเติม
                                            </p>
                                            {orderDetail?.data?.order.status_order === "delivered" && (
                                                <ReviewModal product={item} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xl">
                                    ฿{(item.productPrice * item.quantity).toLocaleString("en-US")}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-100 w-full h-[1.5px]"></div>
                    <div className="flex flex-col gap-2 pr-6">
                        <div className="flex flex-row justify-between font-light">
                            <p>
                                ยอดรวมสินค้า (
                                {orderDetail?.data?.order.order_items.reduce(
                                    (acc, item) => acc + item.quantity,
                                    0
                                )}{" "}
                                ชิ้น)
                            </p>
                            <p className="text-xl">
                                ฿
                                {orderDetail?.data?.order.order_items
                                    .reduce((acc, item) => acc + item.productPrice * item.quantity, 0)
                                    .toLocaleString("en-US")}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between font-light">
                            <p>โค้ดส่วนลด</p>
                            <p className=" text-xl">
                                ฿
                                {(
                                    orderDetail?.data?.order.order_items.reduce(
                                        (acc, item) => acc + item.productPrice * item.quantity,
                                        0
                                    ) - orderDetail?.data?.order.value
                                ).toLocaleString("en-US")}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between font-light">
                            <p>ค่าจัดส่ง</p>
                            <p className=" text-xl">฿{"0".toLocaleString("en-US")}</p>
                        </div>
                        <div className="flex flex-row justify-between font-semibold">
                            <p>ยอดสุทธิ</p>
                            <p className="text-xl">฿{orderDetail?.data?.order.value.toLocaleString("en-US")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyOrderDetail;
