import { useEffect, useState } from "react";
import { Space, Table, Input } from "antd";

const getOrders = () => {
    return fetch("https://dummyjson.com/carts/1").then((res) => res.json());
};

function Orders() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchedText, setSearchedText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascend");

    useEffect(() => {
        setLoading(true);
        getOrders().then((res) => {
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
                            title: "Quantity",
                            dataIndex: "quantity",
                        },
                        {
                            title: "Price",
                            dataIndex: "price",
                            render: (value) => <span>฿{value}</span>,
                        },
                        {
                            title: "Total",
                            dataIndex: "total",
                            render: (value) => <span>฿{value}</span>,
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
