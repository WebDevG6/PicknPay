import { useEffect, useState, useRef, useMemo } from "react";
import { Modal, Form, Button, Upload, Image, message, Spin } from "antd";
import { UploadOutlined, ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ax from "@conf/ax";
import conf from "@conf/main";
import useProducts from "@hooks/useProducts";
import useEditProductStore from "./useEditProductStore";
import EditProductForm from "./EditProductForm";

const { confirm } = Modal;

const EditProductModal = ({ visible }) => {
    const { productsLoading } = useProducts();
    const [form] = Form.useForm();
    const MAX_IMAGES = 5;

    const {
        editingProduct,
        setEditingProduct,
        originalPictures,
        pictureList,
        setOriginalPictures,
        setPictureList,
        setSelectedPicture,
    } = useEditProductStore();

    const previewImageRef = useRef("");
    const [previewVisible, setPreviewVisible] = useState(false);

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (visible && editingProduct) {
            const fetchProductData = async () => {
                try {
                    const response = await ax.get(`/products/${editingProduct.documentId}?populate=*`);
                    const productData = response.data.data;
                    const pictures = productData.picture || [];
                    setOriginalPictures(pictures);
                    setPictureList(pictures);
                    setSelectedPicture(pictures.length > 0 ? pictures[0].url : null);

                    form.setFieldsValue({
                        name: productData.name,
                        price: productData.price,
                        stock: productData.stock,
                        description: productData.description,
                        category: productData.category?.id || null,
                        brand: productData.brands?.brandname || "",
                    });
                } catch (error) {
                    console.error("Failed to fetch product data:", error);
                }
            };

            fetchProductData();
        }
    }, [visible, editingProduct]);

    const displayPictures = useMemo(() => pictureList, [pictureList]);

    useEffect(() => {
        setFileList(
            displayPictures.map((pic, index) => ({
                uid: pic.uid || `file-${index}`,
                name: `image-${index}`,
                status: "done",
                url: pic.url ? `${conf.urlPrefix}${pic.url}` : pic.previewUrl,
                originFileObj: pic.originFileObj || null,
            }))
        );
    }, [displayPictures]);

    const handleCancel = () => {
        form.resetFields();
        setEditingProduct(null);
        setPictureList(originalPictures);
        setSelectedPicture(originalPictures.length > 0 ? originalPictures[0].url : null);
    };

    const showDeleteConfirm = (file) => {
        confirm({
            title: "คุณแน่ใจหรือไม่ว่าต้องการลบรูปนี้?",
            icon: <ExclamationCircleOutlined />,
            content: "รูปภาพที่ถูกลบจะไม่สามารถกู้คืนได้",
            okText: "ลบ",
            okType: "danger",
            cancelText: "ยกเลิก",
            onOk() {
                const newList = pictureList.filter(
                    (pic) => (pic.url ? `${conf.urlPrefix}${pic.url}` : pic.previewUrl) !== file.url
                );

                setPictureList(newList);
            },
        });
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
                        <h3 className="text-lg mb-2">รูปสินค้า</h3>
                        {displayPictures.length > 0 ? (
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true }}
                                loop
                                className="w-full max-w-lg"
                            >
                                {displayPictures.map((pic, index) => {
                                    const imgSrc = pic.url ? `${conf.urlPrefix}${pic.url}` : pic.previewUrl;
                                    return (
                                        <SwiperSlide
                                            key={index}
                                            className="flex justify-center items-center h-[180px] cursor-pointer"
                                        >
                                            <Image
                                                src={imgSrc}
                                                className="rounded-md max-h-[50%] max-w-[50%] object-contain mx-auto"
                                                preview={true}
                                            />
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        ) : (
                            <p className="text-gray-500 text-center">ไม่มีรูปภาพ</p>
                        )}

                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            showUploadList={{
                                showPreviewIcon: false,
                                removeIcon: <DeleteOutlined style={{ color: "red" }} />,
                                motion: false,
                                showDownloadIcon: true,
                            }}
                            onRemove={showDeleteConfirm}
                            beforeUpload={(file) => {
                                if (pictureList.length >= MAX_IMAGES) {
                                    message.error(`สามารถอัปโหลดได้สูงสุด ${MAX_IMAGES} รูป`);
                                    return Upload.LIST_IGNORE;
                                }

                                const newFile = {
                                    previewUrl: URL.createObjectURL(file),
                                    originFileObj: file,
                                };

                                const updatedPictures = [...pictureList, newFile];
                                setPictureList(updatedPictures);

                                return false;
                            }}
                        />

                        {displayPictures.length < MAX_IMAGES && (
                            <Button
                                icon={<UploadOutlined />}
                                onClick={() => document.querySelector(".ant-upload input[type='file']").click()}
                                type="default"
                                className="mt-2"
                            >
                                อัปโหลดรูปภาพ
                            </Button>
                        )}
                    </div>

                    <div className="w-full">
                        <EditProductForm
                            form={form}
                            product={editingProduct}
                            onUpdate={handleCancel}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}
            <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <Image style={{ width: "100%" }} src={previewImageRef.current} />
            </Modal>
        </Modal>
    );
};

export default EditProductModal;
