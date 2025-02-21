import React, { useEffect, useState } from "react";
import { Avatar, Rate, Space, Table, Input, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import conf from "../../conf/main";

// ฟังก์ชันดึงข้อมูลจาก API
const fetchProducts = async () => {
    const res = await fetch("http://localhost:1337/api/products?populate=*");
    const json = await res.json();

    return json.data.map((product) => ({
        key: product.id,
        thumbnail: conf.urlPrefix + product.picture[0]?.formats.small.url,
        title: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category?.name || "N/A",
        brand: product.brands?.brandname || "N/A",
        createdAt: new Date(product.createdAt).toLocaleString(),
    }));
};

const Products = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });
    
    const [searchedText, setSearchedText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascend");

    return (
        <div className="p-[18px] flex flex-col rounded-lg bg-white overflow-x-auto max-w-full mt-2">
            <Space size={20} direction="vertical">
                <Input
                    placeholder="Search here..."
                    style={{ width: "100%", marginBottom: 20 }}
                    onChange={(e) => setSearchedText(e.target.value)}
                />
            </Space>
            <Table
                loading={isLoading}
                columns={[
                    {
                        title: "Preview",
                        dataIndex: "thumbnail",
                        render: (link) => <Avatar src={<img src={link}/>} />, 
                    },
                    {
                        title: "Product Name",
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
                        render: (value) => <span>฿{value}</span>,
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
                dataSource={data}
                pagination={{ pageSize: 8 }}
                scroll={{ x: "max-content" }}
            />
        </div>
    );
};

export default Products;
