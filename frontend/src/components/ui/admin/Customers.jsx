import React from "react";
import { Avatar, Space, Table, Input } from "antd";
import { useEffect, useState } from "react";

const getCustomers = () => {
    return fetch("https://dummyjson.com/users").then((res) => res.json());
};

const Customers = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchedText, setSearchedText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascend");

    useEffect(() => {
        setLoading(true);
        getCustomers().then((res) => {
            setDataSource(res.users);
            setLoading(false);
        });
    }, []);

    return (
        <div
            style={{
                padding: "22px", display: "flex", flexDirection: "column", borderRadius: "22px", backgroundColor: "white", overflowX: "auto", maxWidth: "100%",marginTop:"8px"
            }}>
            <Input.Search placeholder="Search here..." style={{ width: "100%", marginBottom: 20 }} onSearch={(value) => { setSearchedText(value) }} onChange={(e) => { setSearchedText(e.target.value) }} />
            <Space size={20} direction="vertical">
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Photo",
                            dataIndex: "image",
                            render: (link) => {
                                return <Avatar src={link} />;
                            },
                        },
                        {
                            title: "First Name",
                            dataIndex: "firstName",
                            filteredValue: searchedText ? [searchedText] : null,
                            onFilter: (value, record) => { return String(record.firstName).toLowerCase().includes(value.toLowerCase()), String(record.lastName).toLowerCase().includes(value.toLowerCase()) },
                            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
                            sortOrder,
                            onHeaderCell: () => ({
                                onClick: () => setSortOrder(sortOrder === "ascend" ? "descend" : "ascend"),
                            }),
                        },
                        {
                            title: "Last Name",
                            dataIndex: "lastName",
                        },
                        {
                            title: "Email",
                            dataIndex: "email",
                        },
                        {
                            title: "Phone",
                            dataIndex: "phone",
                        },
                        {
                            title: "Address",
                            dataIndex: "address",
                            render: (address) => {
                                return (
                                    <span>
                                        {address.address}, {address.city}
                                    </span>
                                );
                            },
                        },
                    ]}
                    dataSource={dataSource}
                    pagination={{ pageSize: 8 }}
                    scroll={{ x: "max-content" }}
                />
            </Space>
        </div>
    );
};
export default Customers;
