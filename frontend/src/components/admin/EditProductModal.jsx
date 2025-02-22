import { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Upload,
    Image,
    message,
    Spin
} from "antd";
import {
    UploadOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ax from "../../conf/ax";
import conf from "../../conf/main";
import useProducts from "../../hooks/useProducts";

const { confirm } = Modal;

const EditProductModal = ({ visible, onClose, product }) => {
    const { categories, updateProduct, productsLoading } = useProducts();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [originalPictures, setOriginalPictures] = useState([]);
    const [pictureList, setPictureList] = useState([]);
    const [selectedPicture, setSelectedPicture] = useState(null);

    useEffect(() => {
        if (visible && product) {
            const pictures = product.picture || [];
            setOriginalPictures(pictures);
            setPictureList(pictures);
            setSelectedPicture(pictures.length > 0 ? pictures[0].url : null);

            form.setFieldsValue({
                name: product.name,
                price: product.price,
                stock: product.stock,
                description: product.description,
                category: product.category?.id || null,
            });
        }
    }, [visible, product]);
    const handleLocalPreview = (file) => {
        const previewUrl = URL.createObjectURL(file);
        setPictureList((prev) => [
            ...prev,
            {
                file,
                previewUrl,
            },
        ]);
        setSelectedPicture(previewUrl);
        return false;
    };

    const confirmDeletePicture = (picture) => {
        confirm({
            title: "คุณแน่ใจหรือไม่?",
            icon: <ExclamationCircleOutlined />,
            content: "การลบรูปนี้จะไม่สามารถกู้คืนได้",
            okText: "ใช่, ลบเลย",
            cancelText: "ยกเลิก",
            onOk() {
                const updated = pictureList.filter((pic) => pic !== picture);
                setPictureList(updated);

                if (updated.length > 0) {
                    const firstPic = updated[0];
                    setSelectedPicture(firstPic.url ?? firstPic.previewUrl);
                } else {
                    setSelectedPicture(null);
                }
            },
        });
    };
    const handleUpdate = async (values) => {
        setLoading(true);

        try {
            const newPictures = pictureList.filter((pic) => pic.file && !pic.id);
            const uploadedIds = [];

            for (const pic of newPictures) {
                const formData = new FormData();
                formData.append("files", pic.file);
                const response = await ax.post(`${conf.apiUrlPrefix}/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (response.data && response.data.length > 0) {
                    uploadedIds.push(response.data[0].id);
                }
            }
            const oldIds = pictureList
                .filter((p) => p.id && !p.file)
                .map((p) => p.id);

            // รวม id รูปทั้งหมด
            const allImageIds = [...oldIds, ...uploadedIds];
            await updateProduct({
                documentId: product.documentId,
                productData: {
                    ...values,
                    picture: allImageIds,
                },
            });
            const removedPictures = originalPictures.filter(
                (origPic) => !pictureList.some((pic) => pic.id === origPic.id)
            );

            for (const removedPic of removedPictures) {
                await ax.delete(`${conf.apiUrlPrefix}/upload/files/${removedPic.id}`);
            }

            // เสร็จเรียบร้อย
            message.success("อัปเดตสินค้าสำเร็จ!");
            onClose();
        } catch (error) {
            console.error("Update Failed:", error);
            message.error("อัปเดตสินค้าล้มเหลว!");
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setPictureList(originalPictures);
        setSelectedPicture(
            originalPictures.length > 0 ? originalPictures[0].url : null
        );
        onClose();
    };

    return (
        <Modal
            title="แก้ไขสินค้า"
            open={visible}
            onCancel={handleCancel}
            width="90vw"
            footer={null}
            className="max-w-[1200px]"
        >
            {productsLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2">📸 รูปสินค้า</h3>
                        {pictureList.length > 0 ? (
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true }}
                                loop
                                className="w-full max-w-lg"
                            >
                                {pictureList.map((pic, index) => {
                                    const imgSrc = pic.url
                                        ? `${conf.urlPrefix}${pic.url}`
                                        : pic.previewUrl;
                                    return (
                                        <SwiperSlide
                                            key={index}
                                            className="flex justify-center items-center h-[200px]"
                                        >
                                            <Image
                                                src={imgSrc}
                                                className="rounded-md max-h-[55%] max-w-[55%] object-contain mx-auto"
                                                preview={false}
                                            />
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        ) : (
                            <p className="text-gray-500 text-center">ไม่มีรูปภาพ</p>
                        )}
                        <div className="flex gap-2 mt-4 overflow-x-auto">
                            {pictureList.map((pic, index) => {
                                const thumbSrc = pic.url ? `${conf.urlPrefix}${pic.url}` : pic.previewUrl;

                                return (
                                    <div
                                        key={index}
                                        className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer flex justify-center items-center border-2 transition-all 
                    ${selectedPicture === thumbSrc ? "border-blue-500" : "border-gray-300"}`}
                                        onClick={() => setSelectedPicture(thumbSrc)}
                                    >
                                        <Image
                                            src={thumbSrc}
                                            preview={false}
                                            className="w-auto h-auto max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <Upload
                                listType="picture"
                                maxCount={5}
                                showUploadList={false}
                                beforeUpload={handleLocalPreview}
                            >
                                <Button icon={<UploadOutlined />}>อัปโหลดรูปใหม่</Button>
                            </Upload>

                            {selectedPicture && (
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        const foundPic = pictureList.find((pic) => {
                                            const src = pic.url
                                                ? `${conf.urlPrefix}${pic.url}`
                                                : pic.previewUrl;
                                            return src === selectedPicture;
                                        });
                                        if (foundPic) confirmDeletePicture(foundPic);
                                    }}
                                >
                                    ลบรูปที่เลือก
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-2">รายละเอียดสินค้า</h3>
                        <Form form={form} layout="vertical" onFinish={handleUpdate}>
                            <Form.Item
                                label="ชื่อสินค้า"
                                name="name"
                                rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
                            >
                                <Input />
                            </Form.Item>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item
                                    label="ราคา"
                                    name="price"
                                    rules={[{ required: true, message: "กรุณากรอกราคา" }]}
                                >
                                    <InputNumber min={0} className="w-full" />
                                </Form.Item>
                                <Form.Item
                                    label="จำนวนสต็อก"
                                    name="stock"
                                    rules={[
                                        { required: true, message: "กรุณากรอกจำนวนสต็อก" },
                                    ]}
                                >
                                    <InputNumber min={0} className="w-full" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label="หมวดหมู่"
                                name="category"
                                rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}
                            >
                                <Select placeholder="เลือกหมวดหมู่">
                                    {categories.map((cat) => (
                                        <Select.Option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="คำอธิบายสินค้า" name="description">
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <div className="flex justify-end gap-2">
                                <Button onClick={handleCancel}>ยกเลิก</Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    บันทึกการเปลี่ยนแปลง
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </Modal>
    );
};


export default EditProductModal;
