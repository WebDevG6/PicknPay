import React, { useState, useMemo } from "react";
import { Button, Table, Tag } from "antd";
import { PlusCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { useCouponQuery } from "../../hooks/queryAdmin";
import dayjs from "dayjs";

const Coupon = () => {
    const { data: coupons, isLoading } = useCouponQuery();
    const [filter, setFilter] = useState("all");

    const filteredCoupons = useMemo(() => {
        if (!coupons?.data) return [];
        if (filter === "valid") return coupons.data.filter((coupon) => coupon.valid);
        if (filter === "expired") return coupons.data.filter((coupon) => !coupon.valid);
        return coupons.data;
    }, [coupons, filter]);

    const columns = [
        {
            title: "Status",
            dataIndex: "valid",
            key: "valid",
            render: (status) => <Tag color={status ? "success" : "error"}>{status ? "ใช้งานอยู่" : "หมดอายุ"}</Tag>,
        },
        {
            title: "Coupon",
            dataIndex: "id",
            key: "id",
        },

        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },

        {
            title: "Expires",
            dataIndex: "redeem_by",
            key: "redeem_by",
            render: (day) => (day ? dayjs.unix(day).format("DD/MM/YYYY HH:mm:ss") : "-"),
        },
        {
            title: "Redemptions",
            dataIndex: "times_redeemed",
            key: "times_redeemed",
        },
        {
            title: "Max redemptions",
            dataIndex: "max_redemptions",
            key: "max_redemptions",
            render: (max) => (max ? max : "-"),
        },
    ];

    return (
        <div className="p-[18px] flex flex-col rounded-lg bg-white overflow-x-auto max-w-full mt-2">
            <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-4">
                    <Button type="primary" icon={<PlusCircleOutlined />}>
                        เพิ่มคูปองใหม่
                    </Button>
                    <Button
                        type={filter === "all" ? "primary" : "default"}
                        icon={<FilterOutlined />}
                        onClick={() => setFilter("all")}
                    >
                        คูปองทั้งหมด
                    </Button>
                    <Button
                        icon={<FilterOutlined />}
                        onClick={() => setFilter("valid")}
                        variant={filter === "valid" ? "solid" : "outlined"}
                        color="green"
                    >
                        คูปองที่ใช้งานได้
                    </Button>
                    <Button
                        type={filter === "expired" ? "primary" : "default"}
                        danger
                        icon={<FilterOutlined />}
                        onClick={() => setFilter("expired")}
                    >
                        คูปองหมดอายุแล้ว
                    </Button>
                </div>
                <Table loading={isLoading} dataSource={filteredCoupons} columns={columns} rowKey="id" />
            </div>
        </div>
    );
};

export default Coupon;
