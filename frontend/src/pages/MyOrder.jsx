import React, { useContext } from "react";
import { Tabs, List, Card, Tag } from "antd";
import { authContext } from "../context/AuthContext";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    TruckOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const statusConfig = {
    processing: { color: "processing", icon: <SyncOutlined />, label: "Payment Processing" },
    successed: { color: "gold", icon: <WalletOutlined />, label: "Payment Successed" },
    payment_failed: { color: "error", icon: <CloseCircleOutlined />, label: "Payment Failed" },
    shipping: { color: "geekblue", icon: <TruckOutlined />, label: "Shipping" },
    delivered: { color: "success", icon: <CheckCircleOutlined />, label: "Paid and Delivered" },
};

const OrderList = ({ orders }) => (
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
                        title={
                            <div className="flex justify-between">
                                <div className="flex flex-row gap-2">
                                    <Tag color={color} icon={icon}>
                                        {label}
                                    </Tag>
                                    <p>รายการคำสั่งซื้อ</p>
                                    <p className="font-normal"> #{item.documentId}</p>
                                </div>
                                <p>฿{item.value.toLocaleString("en-US")}</p>
                            </div>
                        }
                        className="w-full"
                    >
                        <p>
                            <b>วันที่สั่งซื้อ:</b> {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                        </p>
                        <p>
                            <b>จำนวนสินค้า:</b> {item.order_items.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น
                        </p>
                    </Card>
                </List.Item>
            );
        }}
    />
);

const MyOrder = () => {
    const { userInfo } = useContext(authContext);

    const items = [
        { key: "1", label: "ทั้งหมด", orders: userInfo?.orders },
        {
            key: "2",
            label: "การจ่ายเงิน",
            orders: userInfo?.orders.filter(
                (item) =>
                    item.status_order === "processing" ||
                    item.status_order === "payment_failed" ||
                    item.status_order === "successed"
            ),
        },
        {
            key: "3",
            label: "อยู่ระหว่างจัดส่ง",
            orders: userInfo?.orders.filter((item) => item.status_order === "shipping"),
        },
        {
            key: "4",
            label: "จัดส่งสำเร็จ",
            orders: userInfo?.orders.filter((item) => item.status_order === "delivered"),
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <div>
                <p className="text-2xl font-semibold tracking-wide font-[Kanit]">รายการสินค้าของฉัน</p>
            </div>
            <div className="bg-white p-8 rounded-sm w-full">
                <Tabs defaultActiveKey="1">
                    {items.map(({ key, label, orders }) => (
                        <Tabs.TabPane tab={label} key={key}>
                            <OrderList orders={orders} />
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </div>
        </div>
    );
};

export default MyOrder;
