import React from "react";
import { Button, Table } from "antd";
import { PlusCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { useCouponQuery } from "../../hooks/queryAdmin";

const Coupon = () => {
    const { data: coupons, isLoading } = useCouponQuery();
    console.log(coupons);
    return (
        <div className="p-[18px] flex flex-col rounded-lg bg-white overflow-x-auto max-w-full mt-2">
            <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-4">
                    <Button type="primary" icon={<PlusCircleOutlined />}>
                        เพิ่มคูปองใหม่
                    </Button>
                    <Button variant="outlined" color="primary" icon={<FilterOutlined />}>
                        คูปองทั้งหมด
                    </Button>
                    <Button variant="outlined" color="green" icon={<FilterOutlined />}>
                        คูปองที่ใช้งานได้
                    </Button>
                    <Button variant="outlined" danger icon={<FilterOutlined />}>
                        คูปองหมดอายุแล้ว
                    </Button>
                </div>
                {/* <Table dataSource={dataSource} columns={columns} /> */}
            </div>
        </div>
    );
};

export default Coupon;
