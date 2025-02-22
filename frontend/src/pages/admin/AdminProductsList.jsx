import React from "react";
import { Avatar, Space, Table, Input, Spin, Alert } from "antd";
import { useState } from "react";
import useProducts from "../../hooks/useProducts";
import conf from "../../conf/main";

const AdminProductsList = () => {
    const { products, productsLoading, productsError } = useProducts();
    const [searchedText, setSearchedText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascend");

    if (productsError) {
        return <Alert message="Error loading products" type="error" />;
    }

    return (
        <div className="p-[18px] flex flex-col rounded-lg bg-white overflow-x-auto max-w-full mt-2">
            <Input
                placeholder="Search here..."
                style={{ width: "100%", marginBottom: 20 }}
                onChange={(e) => setSearchedText(e.target.value)}
            />

            <Space size={20} direction="vertical">
                {productsLoading ? (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                        width: "100%",
                    }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={[
                            {
                                title: "Thumbnail",
                                dataIndex: "picture",
                                render: (pictures) => {
                                    const imageUrl = pictures?.[0]?.url ? `${conf.urlPrefix}${pictures[0].url}` : "/default-image.jpg";
                                    return <Avatar src={imageUrl} />;
                                },
                            },
                            {
                                title: "Product Name",
                                dataIndex: "name",
                                filteredValue: searchedText ? [searchedText] : null,
                                onFilter: (value, record) =>
                                    String(record.name).toLowerCase().includes(value.toLowerCase()),
                                sorter: (a, b) => a.name.localeCompare(b.name),
                                sortOrder,
                                onHeaderCell: () => ({
                                    onClick: () =>
                                        setSortOrder(sortOrder === "ascend" ? "descend" : "ascend"),
                                }),
                            },
                            {
                                title: "Price",
                                dataIndex: "price",
                                render: (value) => <span>฿{value}</span>,
                            },
                            {
                                title: "Stock",
                                dataIndex: "stock",
                            },
                            {
                                title: "Category",
                                dataIndex: "category",
                                render: (category) => category?.name || "N/A",
                            },
                            {
                                title: "Brand",
                                dataIndex: "brands",
                                render: (brands) => brands?.brandname || "N/A",
                            },
                        ]}
                        dataSource={products}
                        rowKey="id"
                        pagination={{ pageSize: 8 }}
                        scroll={{ x: "max-content" }}
                    />
                )}
            </Space>
        </div>
    );
};

export default AdminProductsList;
