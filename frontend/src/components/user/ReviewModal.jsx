import React, { useState, useContext } from "react";
import { Modal, Form, Input, message, Rate } from "antd";
import conf from "../../conf/main";
import { authContext } from "../../context/AuthContext";
import { useReviewCreate } from "../../hooks/service";

const { TextArea } = Input;

function ReviewModal({ product }) {
    const { userInfo } = useContext(authContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const reviewCreate = useReviewCreate();
    message.config({ maxCount: 2 });

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            reviewCreate.mutate(
                {
                    comment: values.comment,
                    productId: product.productId,
                    rating: values.rate,
                },
                {
                    onSuccess: () => {
                        message.success("รีวิวของคุณถูกส่งเรียบร้อยแล้ว!");
                        setIsModalOpen(false);
                        form.resetFields();
                    },
                }
            );
        } catch (error) {
            message.error(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    return (
        <>
            <p onClick={showModal} className="text-xs text-gray-500 cursor-pointer hover:underline">
                ให้คะแนนและรีวิวสินค้า
            </p>
            <Modal
                centered
                title="ให้คะแนนและรีวิวสินค้า"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose
                okText="ส่ง"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex flex-row items-center space-x-4 w-full">
                        <img
                            className="w-24 h-24 object-cover rounded-lg"
                            src={conf.urlPrefix + product.productImageUrl}
                        />
                        <div className="flex flex-col">
                            <p className="text-lg font-medium">{product.productName}</p>
                            <p className="text-sm text-gray-500">
                                ฿{Number(product.productPrice).toLocaleString("en-US")}
                            </p>
                        </div>
                    </div>

                    <Form form={form} requiredMark={false} className="w-full">
                        <Form.Item
                            name="rate"
                            rules={[{ required: true, message: "กรุณาให้คะแนนสินค้า" }]}
                            className="w-full flex justify-start"
                        >
                            <Rate style={{ fontSize: 32 }} />
                        </Form.Item>
                        <Form.Item
                            name="comment"
                            rules={[{ required: true, message: "กรุณาเขียนรีวิวสินค้า" }]}
                            className="w-full"
                        >
                            <TextArea
                                autoSize={{ minRows: 3, maxRows: 6 }}
                                className="w-full"
                                placeholder="แสดงความคิดเห็นของคุณ..."
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ReviewModal;
