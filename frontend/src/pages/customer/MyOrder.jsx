import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { authContext } from "@context/AuthContext";
import { Tabs, List, Card, Tag } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    TruckOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import conf from "@conf/main";
import dayjs from "dayjs";

const statusConfig = {
    processing: { color: "processing", icon: <SyncOutlined />, label: "กำลังดำเนินการชำระเงิน" },
    successed: { color: "gold", icon: <WalletOutlined />, label: "ชำระเงินสำเร็จ" },
    payment_failed: { color: "error", icon: <CloseCircleOutlined />, label: "ชำระเงินล้มเหลว" },
    shipping: { color: "geekblue", icon: <TruckOutlined />, label: "กำลังจัดส่ง" },
    delivered: { color: "success", icon: <CheckCircleOutlined />, label: "จัดส่งสำเร็จ" },
};

const OrderList = ({ orders }) => {
    const navigate = useNavigate();

    return (
        <List
            itemLayout="horizontal"
            dataSource={orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
            renderItem={(item) => {
                const { color, icon, label } = statusConfig[item.status_order] || {
                    color: "default",
                    icon: null,
                    label: "Not Found",
                };
                return (
                    <List.Item>
                        <Card
                            onClick={() => {
                                navigate(`/customer/order/${item.documentId}`);
                            }}
                            type="inner"
                            hoverable
                            title={
                                <div className="flex justify-between">
                                    <div className="flex flex-row gap-2 items-center">
                                        <Tag color={color} icon={icon}>
                                            {label}
                                        </Tag>
                                        <p>รายการคำสั่งซื้อ</p>
                                        <p className="font-normal"> #{item.documentId}</p>
                                    </div>
                                    <p className="text-lg">฿{item.value.toLocaleString("en-US")}</p>
                                </div>
                            }
                            className="w-full"
                        >
                            <div className="flex flex-row gap-6 justify-between">
                                <div>
                                    <div className="flex flex-row gap-1">
                                        <p className="font-semibold">วันที่สั่งซื้อ:</p>
                                        {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <p className="font-semibold">จำนวนสินค้า:</p>
                                        {item.order_items.reduce((sum, item) => sum + Number(item.quantity), 0)} ชิ้น
                                    </div>
                                </div>
                                {item.order_items[0].thumbnail && (
                                    <div>
                                        <img
                                            className="w-23 h-23 object-cover"
                                            src={`${conf.urlPrefix}${item.order_items[0].thumbnail}`}
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>
                    </List.Item>
                );
            }}
        />
    );
};

const MyOrder = () => {
    const { userInfo } = useContext(authContext);

    const items = [
        { key: "1", label: "ทั้งหมด", children: <OrderList orders={userInfo?.orders} /> },
        {
            key: "2",
            label: "การจ่ายเงิน",
            children: (
                <OrderList
                    orders={userInfo?.orders.filter(
                        (item) =>
                            item.status_order === "processing" ||
                            item.status_order === "payment_failed" ||
                            item.status_order === "successed"
                    )}
                />
            ),
        },
        {
            key: "3",
            label: "อยู่ระหว่างจัดส่ง",
            children: <OrderList orders={userInfo?.orders.filter((item) => item.status_order === "shipping")} />,
        },
        {
            key: "4",
            label: "จัดส่งสำเร็จ",
            children: <OrderList orders={userInfo?.orders.filter((item) => item.status_order === "delivered")} />,
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-2xl font-semibold tracking-wide font-Kanit]">รายการสั่งซื้อของฉัน</p>
            </div>
            <div className="bg-white p-8 rounded-sm w-full">
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </div>
    );
};

export default MyOrder;
