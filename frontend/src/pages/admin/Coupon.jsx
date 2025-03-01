import { useState, useMemo } from "react";
import { Modal, Form, Input, Select, InputNumber, message, Button, Table, Tag, DatePicker } from "antd";
import { PlusCircleOutlined, FilterOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCouponQuery } from "@hooks/queryAdmin";
import { useCouponCreate, useCouponDelete } from "@hooks/serviceAdmin";
import dayjs from "dayjs";

const Coupon = () => {
    const { data: coupons, isLoading, refetch } = useCouponQuery();
    const couponCreate = useCouponCreate();
    const couponDelete = useCouponDelete();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState("all");
    const [form] = Form.useForm();
    message.config({ maxCount: 2 });

    const filteredCoupons = useMemo(() => {
        if (!coupons?.data) return [];
        if (filter === "valid") return coupons.data.filter((coupon) => coupon.valid);
        if (filter === "expired") return coupons.data.filter((coupon) => !coupon.valid);
        return coupons.data;
    }, [coupons, filter]);

    const handleOk = async () => {
        try {
            const couponForm = await form.validateFields();
            console.log(couponForm);
            const couponDetail = {
                id: couponForm.id,
                max_redemptions: couponForm.max,
                redeem_by: couponForm.expired?.unix(),
                ...(couponForm.type === "percent_off"
                    ? { percent_off: couponForm.discountValue }
                    : { amount_off: couponForm.discountValue * 100, currency: "thb" }),
            };
            couponCreate.mutate(
                { couponDetail },
                {
                    onSuccess: () => {
                        message.success("เพิ่มคูปองสำเร็จ");
                        refetch();
                    },
                }
            );
            setIsModalOpen(false);
        } catch (error) {
            message.error("เพิ่มคูปองล้มเหลว");
        }
    };

    const handleDelete = (couponId) => {
        couponDelete.mutate(
            { couponId },
            {
                onSuccess: () => {
                    message.success("ลบคูปองสำเร็จ");
                    refetch();
                },
                onError: () => {
                    message.error("ลบคูปองล้มเหลว");
                },
            }
        );
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const columns = [
        {
            title: "Coupon",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Discount",
            render: (_, record) => {
                if (record.percent_off !== null) {
                    return `${record.percent_off}%`;
                } else if (record.amount_off !== null) {
                    return `${record.amount_off / 100} THB`;
                }
                return "-";
            },
        },
        {
            title: "Status",
            dataIndex: "valid",
            key: "valid",
            render: (status) => <Tag color={status ? "success" : "error"}>{status ? "ใช้งานอยู่" : "หมดอายุ"}</Tag>,
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
        {
            title: "Action",
            render: (_, record) => (
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
            ),
        },
    ];

    return (
        <div className="p-[18px] flex flex-col rounded-lg bg-white overflow-x-auto max-w-full mt-2">
            <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-4">
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={showModal}>
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
                <Modal
                    centered
                    title="คูปอง"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    destroyOnClose
                    okText="เพิ่ม"
                    cancelText="ยกเลิก"
                >
                    <Form
                        style={{ marginTop: 20 }}
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        form={form}
                        requiredMark={false}
                    >
                        <Form.Item name="id" label="โค้ด" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="type" label="ประเภท" rules={[{ required: true }]}>
                            <Select
                                options={[
                                    { label: "ส่วนลดเป็นเปอร์เซ็นต์", value: "percent_off" },
                                    { label: "ส่วนลดเป็นจำนวนเงิน", value: "amount_off" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item name="discountValue" label="จำนวนส่วนลด" rules={[{ required: true }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="max" label="จำนวนการใช้สูงสุด">
                            <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item name="expired" label="วันหมดอายุ">
                            <DatePicker showTime placeholder="" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Coupon;
