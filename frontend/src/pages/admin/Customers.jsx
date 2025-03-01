import { useState } from "react";
import { Space, Table, Input } from "antd";
import useDataAdmin from "@hooks/useDataAdmin";
import { motion } from "framer-motion";

const Customers = () => {
    const { customers, customersLoading } = useDataAdmin();
    const [searchedText, setSearchedText] = useState("");
    const [sortOrder, setSortOrder] = useState({ column: null, order: null });

    const handleSort = (column) => {
        setSortOrder((prev) => {
            let newOrder = "ascend";
            if (prev.column === column) {
                newOrder = prev.order === "ascend" ? "descend" : "ascend";
            }
            return { column, order: newOrder };
        });
    };

    const dataSource = customers.map((customer) => ({
        key: customer.id,
        firstname: customer.firstname || "-",
        lastname: customer.lastname || "-",
        email: customer.email || "-",
        address: customer.address || "No Address Provided",
    }));

    const filteredData = dataSource.filter((record) =>
        Object.values(record).some((value) => String(value).toLowerCase().includes(searchedText))
    );

    const columns = [
        {
            title: "First Name",
            dataIndex: "firstname",
            key: "firstname",
            sorter: (a, b) => a.firstname.localeCompare(b.firstname),
            sortOrder: sortOrder.column === "firstname" ? sortOrder.order : null,
            onHeaderCell: () => ({
                onClick: () => handleSort("firstname"),
            }),
        },
        {
            title: "Last Name",
            dataIndex: "lastname",
            key: "lastname",
            sorter: (a, b) => a.lastname.localeCompare(b.lastname),
            sortOrder: sortOrder.column === "lastname" ? sortOrder.order : null,
            onHeaderCell: () => ({
                onClick: () => handleSort("lastname"),
            }),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
    ];

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.3 },
        }),
    };

    return (
        <div className="p-[18px] flex flex-col rounded-lg bg-white overflow-x-auto max-w-full mt-2">
            <Input
                placeholder="ค้นหาลูกค้า"
                style={{ width: "100%", marginBottom: 20 }}
                onChange={(e) => setSearchedText(e.target.value.toLowerCase())}
                allowClear
            />
            <Space size={20} direction="vertical">
                <div className="flex flex-col min-h-[500px] rounded-2xl">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{ pageSize: 8 }}
                        bordered={true}
                        scroll={{ x: true }}
                        className="w-full flex-grow"
                        size="small"
                        components={{
                            body: {
                                wrapper: motion.tbody,
                                row: motion.tr,
                            },
                        }}
                        rowClassName={(record, index) => "table-row"}
                        onRow={(record, index) => ({
                            initial: "hidden",
                            animate: "visible",
                            custom: index,
                            variants: rowVariants,
                        })}
                    />
                </div>
            </Space>
        </div>
    );
};

export default Customers;
