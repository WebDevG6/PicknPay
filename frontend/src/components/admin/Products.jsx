import React from "react";
import { Avatar, Rate, Space, Table, Input } from "antd";
import { useEffect, useState } from "react";

const getInventory = () => {
    return fetch("https://dummyjson.com/products").then((res) => res.json());
};

const Products = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchedText, setSearchedText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascend");

    useEffect(() => {
        setLoading(true);
        getInventory().then((res) => {
            setDataSource(res.products);
            setLoading(false);
        });
    }, []);

    return (
        <div className="p-[18px] flex flex-col rounded-lg bg-white overflow-x-auto max-w-full mt-2">
            <Input placeholder="Search here..." style={{ width: "100%", marginBottom: 20 }} onSearch={(value) => { setSearchedText(value) }} onChange={(e) => { setSearchedText(e.target.value) }} />
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
                            filteredValue: searchedText ? [searchedText] : null,
                            onFilter: (value, record) => String(record.title).toLowerCase().includes(value.toLowerCase()),
                            sorter: (a, b) => a.title.localeCompare(b.title),
                            sortOrder,
                            onHeaderCell: () => ({
                                onClick: () => setSortOrder(sortOrder === "ascend" ? "descend" : "ascend"),
                            }),
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
