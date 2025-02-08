import React from "react";
import { Avatar, Space, Table } from "antd";
import { useEffect, useState } from "react";

const getCustomers = () => {
    return fetch("https://dummyjson.com/users").then((res) => res.json());
};

const Customers = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

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
                padding: "22px", display: "flex", flexDirection: "column", borderRadius: "22px", backgroundColor: "white", overflowX: "auto", maxWidth: "100%"
            }}>
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
