import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button } from "antd";
import { usePromotionQuery, useCouponDetailQuery } from "../../hooks/queryAdmin";
import dayjs from "dayjs";

function Promotion() {
    const { couponId } = useParams();
    const { data: promotions } = usePromotionQuery(couponId);
    const { data: couponDeatils } = useCouponDetailQuery(couponId);
    console.log(promotions);
    const columns = [
        {
            title: "Promotion Code",
            dataIndex: "name",
        },
        {
            title: "Redemptions",
            dataIndex: "age",
        },
        {
            title: "Expires",
            dataIndex: "address",
        },
    ];
    const dataSource = Array.from({
        length: 46,
    }).map((_, i) => ({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
    }));

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div className="p-[18px] flex flex-col rounded-lg bg-white overflow-x-auto max-w-full mt-2 gap-12">
            <p className="text-2xl font-semibold">{couponId}</p>
            <div className="flex flex-col gap-4 text-lg">
                <p className="text-xl font-semibold">รายละเอียด</p>
                <div className="flex flex-row gap-48 text-base">
                    <div className="flex flex-col gap-2">
                        <p>ID: {couponDeatils.id}</p>
                        <p>Name: {couponDeatils.name}</p>
                        <p>Created: {dayjs.unix(couponDeatils.created).format("DD/MM/YYYY HH:mm:ss")}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Valid: {couponDeatils.valid ? "yes" : "no"}</p>
                        {couponDeatils.percent_off ? (
                            <p>Percentage discount: {couponDeatils.percent_off}%</p>
                        ) : (
                            <p>Amount discount: {couponDeatils.amount_off}</p>
                        )}
                        <p>
                            Expires on:{" "}
                            {couponDeatils.redeem_by
                                ? dayjs.unix(couponDeatils.redeem_by).format("DD/MM/YYYY HH:mm:ss")
                                : "-"}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-xl font-semibold">โค้ดโปรโมชั่น</p>
                <div className="flex flex-row gap-4 text-base">
                    <Button type="primary">เพิ่มโปรโมชั่น</Button>
                    <Button danger type="primary">
                        ลบโปรโมชั่น
                    </Button>
                </div>
                <div className="flex flex-col">
                    <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
                </div>
            </div>
        </div>
    );
}

export default Promotion;
