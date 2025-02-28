import { useState, useEffect } from "react";
import { Space, Table, Input, Tag, Button, Modal, Select, message, Collapse } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    TruckOutlined,
    WalletOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { useOrderQuery } from "../../hooks/queryAdmin";
import dayjs from "dayjs";
import { useOrderUpdate } from "../../hooks/service";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderDetail } from "../../hooks/query";
import conf from "../../conf/main";

function Orders() {
    const { data: orders, isLoading } = useOrderQuery();
    const orderDetail = useOrderDetail();
    const updateOrder = useOrderUpdate();
    const queryClient = useQueryClient();
    const [searchedText, setSearchedText] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCollapse, setIsCollapse] = useState(false);
    const statusOptions = [
        { value: "processing", label: "Payment Processing" },
        { value: "successed", label: "Payment Successed" },
        { value: "payment_failed", label: "Payment Failed" },
        { value: "shipping", label: "Shipping" },
        { value: "delivered", label: "Paid and Delivered" },
    ];

    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;

        await updateOrder.mutateAsync(
            { orderId: selectedOrder.documentId, status: selectedStatus },
            {
                onSuccess: () => {
                    message.success("Order status updated successfully!");
                    queryClient.invalidateQueries({ queryKey: ["orders"] });
                    setIsModalOpen(false);
                },
            }
        );
    };

    const showOrderDetails = (order) => {
        setIsCollapse(false);
        setSelectedOrder(order);
        setSelectedStatus(order.status_order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setSelectedStatus("");
    };

    useEffect(() => {
        if (isCollapse) {
            orderDetail.mutate({ orderId: selectedOrder.documentId });
        }
    }, [isCollapse]);

    const orderColumns = [
        {
            title: "Date Time",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            defaultSortOrder: "descend",
            render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
        },
        {
            title: "Status",
            dataIndex: "status_order",
            key: "status_order",
            render(value) {
                const statusConfig = {
                    processing: { color: "processing", icon: <SyncOutlined />, label: "Payment Processing" },
                    successed: { color: "gold", icon: <WalletOutlined />, label: "Payment Successed" },
                    payment_failed: { color: "error", icon: <CloseCircleOutlined />, label: "Payment Failed" },
                    shipping: { color: "geekblue", icon: <TruckOutlined />, label: "Shipping" },
                    delivered: { color: "success", icon: <CheckCircleOutlined />, label: "Paid and Delivered" },
                };

                const { color, icon, label } = statusConfig[value];
                return (
                    <Tag color={color} icon={icon}>
                        {label}
                    </Tag>
                );
            },
            sorter: (a, b) => a.status_order.localeCompare(b.status_order),
        },
        {
            title: "Order ID",
            dataIndex: "documentId",
            key: "documentId",
            filteredValue: searchedText ? [searchedText] : null,
            onFilter: (value, record) => String(record.documentId).toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.documentId.localeCompare(b.documentId),
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            render: (value) => `฿${value.toLocaleString("en-US")}`,
            sorter: (a, b) => a.value - b.value,
        },
        {
            title: "Customer",
            key: "customer",
            dataIndex: [["customer"], ["username"]],
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showOrderDetails(record)}
                        className="border-gray-300 text-gray-600 rounded-md p-2 
                        hover:border-gray-400 hover:bg-gray-100 transition-all duration-300"
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="p-[18px] flex flex-col rounded-lg bg-white overflow-x-auto max-w-full mt-2">
            <Input
                placeholder="Search here"
                style={{ width: "100%", marginBottom: 20 }}
                onChange={(e) => setSearchedText(e.target.value)}
            />
            <Space size={20} direction="vertical">
                <Table
                    loading={isLoading}
                    columns={orderColumns}
                    dataSource={orders?.map((order) => ({ ...order, key: order.id }))}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }}
                />
            </Space>

            <Modal
                title={<p className="text-lg font-bold">Order #{selectedOrder?.documentId}</p>}
                open={isModalOpen}
                onCancel={closeModal}
                onOk={handleUpdateOrder}
            >
                {selectedOrder && (
                    <div className="flex flex-col gap-4">
                        <p className="w-full">
                            <strong>Date Time:</strong> {dayjs(selectedOrder.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                        </p>
                        <p className="w-full">
                            <strong>Stripe ID: </strong> {selectedOrder.stripeId}
                        </p>
                        <p className="w-full flex flex-col gap-2">
                            <strong>Status: </strong>
                            <Select
                                value={selectedOrder.status_order}
                                options={statusOptions}
                                className="w-full"
                                onChange={(value) => setSelectedStatus(value)}
                            />
                        </p>
                        <p className="w-full">
                            <strong>Value:</strong> ฿{selectedOrder.value.toLocaleString("en-US")}
                        </p>
                        <p className="w-full">
                            <strong>Coupon:</strong> {selectedOrder.coupon ? selectedOrder.coupon : "No coupon used"}
                        </p>
                        <Collapse
                            onChange={() => setIsCollapse((prev) => !prev)}
                            activeKey={isCollapse ? ["1"] : []}
                            items={[
                                {
                                    key: 1,
                                    label: "รายการสินค้า",
                                    children: (
                                        <div className="flex flex-col gap-4">
                                            {orderDetail?.data?.order.order_items.map((item) => (
                                                <div
                                                    className="flex flex-row gap-4 justify-between items-center"
                                                    key={item.productId}
                                                >
                                                    <div className="flex flex-row gap-6 items-center ">
                                                        <img
                                                            src={conf.urlPrefix + item.productImageUrl}
                                                            className="w-12 h-12 object-cover rounded-md"
                                                        />
                                                        <div className="flex flex-col">
                                                            <p className="text-md">{item.productName}</p>
                                                            <p className="text-xs text-gray-500">
                                                                ฿{Number(item.productPrice).toLocaleString("en-US")}{" "}
                                                                จำนวน: {item.quantity} ชิ้น
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="text-md">
                                                        ฿{(item.productPrice * item.quantity).toLocaleString("en-US")}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Orders;
