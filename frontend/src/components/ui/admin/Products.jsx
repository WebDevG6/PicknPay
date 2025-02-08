import React from "react";
import { Avatar, Rate, Space, Table } from "antd";
import { useEffect, useState } from "react";

const getInventory = () => {
    return fetch("https://dummyjson.com/products").then((res) => res.json());
};

const Products = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setLoading(true);
        getInventory().then((res) => {
            setDataSource(res.products);
            setLoading(false);
        });
    }, []);

    return (
        <div style={{ padding: "22px", display: "flex", flexDirection: "column", borderRadius: "22px", backgroundColor: "white", overflowX: "auto", maxWidth: "100%" }}>
            <Space size={20} direction="vertical">
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Thumbnail",
                            dataIndex: "thumbnail",
                            render: (link) => {
                                return <Avatar src={link} />;
                            },
                        },
                        {
                            title: "Title",
                            dataIndex: "title",
                        },
                        {
                            title: "Price",
                            dataIndex: "price",
                            render: (value) => <span>${value}</span>,
                        },
                        {
                            title: "Rating",
                            dataIndex: "rating",
                            render: (rating) => {
                                return <Rate value={rating} allowHalf disabled />;
                            },
                        },
                        {
                            title: "Stock",
                            dataIndex: "stock",
                        },

                        {
                            title: "Brand",
                            dataIndex: "brand",
                        },
                        {
                            title: "Category",
                            dataIndex: "category",
                        },
                    ]}
                    dataSource={dataSource}
                    pagination={{
                        pageSize: 8,
                    }}
                    scroll={{ x: "max-content" }}
                >

                </Table>
            </Space>
        </div>
    );
};

export default Products;
