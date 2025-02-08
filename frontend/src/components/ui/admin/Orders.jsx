import { useEffect, useState } from "react";
import { Space, Table,Input } from "antd";

const getOrders = () => {
    return fetch("https://dummyjson.com/carts/1").then((res) => res.json());
};

function Orders() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchedText,setSearchedText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascend");

    useEffect(() => {
        setLoading(true);
        getOrders().then((res) => {
            setDataSource(res.products);
            setLoading(false);
        });
    }, []);

    return (
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", borderRadius: "22px", backgroundColor: "white", overflowX: "auto", maxWidth: "100%" ,marginTop: "8px"}}>
            <Input.Search placeholder="Search here..." style={{ width: "100%", marginBottom: 20 }} onSearch={(value) => {setSearchedText(value)}} onChange={(e) => {setSearchedText(e.target.value)}} />
            <Space size={20} direction="vertical">
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Title",
                            dataIndex: "title",
                            filteredValue: searchedText ? [searchedText] : null,
                            onFilter: (value, record) =>  String(record.title).toLowerCase().includes(value.toLowerCase()),
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
                            title: "DiscountedTotal",
                            dataIndex: "discountedTotal",
                            render: (value) => <span>${value}</span>,
                        },
                        {
                            title: "Quantity",
                            dataIndex: "quantity",
                        },
                        {
                            title: "Total",
                            dataIndex: "total",
                        },
                    ]}
                    dataSource={dataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                    scroll={{ x: "max-content" }} >

                </Table>
            </Space>
        </div >
    );
}
export default Orders;
