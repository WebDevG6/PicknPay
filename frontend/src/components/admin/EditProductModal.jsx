import { useEffect } from "react";
import { Modal, Form, Button, Upload, Image, message, Spin } from "antd";
import { UploadOutlined, DeleteOutlined, } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ax from "../../conf/ax";
import conf from "../../conf/main";
import useProducts from "../../hooks/useProducts";
import useEditProductStore from "./useEditProductStore";
import EditProductForm from "./EditProductForm";

const EditProductModal = ({ visible }) => {
    const { productsLoading } = useProducts();
    const [form] = Form.useForm();
    const MAX_IMAGES = 5;

    const {
        editingProduct,
        setEditingProduct,
        originalPictures,
        pictureList,
        selectedPicture,
        setOriginalPictures,
        setPictureList,
        setSelectedPicture,
        handleLocalPreview,
        confirmDeletePicture,
    } = useEditProductStore();

    useEffect(() => {
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
                    brand: productData.brands?.brandname || '',
                });
            } catch (error) {
                console.error("Failed to fetch product data:", error);
            }
        };

        if (visible && editingProduct) {
            fetchProductData();
        }
    }, [visible, editingProduct]);

    const handleCancel = () => {
        setEditingProduct(null);
        setPictureList(originalPictures);
        setSelectedPicture(originalPictures.length > 0 ? originalPictures[0].url : null);
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
                        <h3 className="text-lg font-semibold mb-2">รูปสินค้า</h3>
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
                                        className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer flex justify-center items-center border-2 transition-all 
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
                            {pictureList.length < MAX_IMAGES && (
                                <Upload
                                    listType="picture"
                                    maxCount={MAX_IMAGES}
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        if (pictureList.length >= MAX_IMAGES) {
                                            message.error(`สามารถอัปโหลดได้สูงสุด ${MAX_IMAGES} รูป`);
                                            return Upload.LIST_IGNORE;
                                        }
                                        handleLocalPreview(file);
                                        return false;
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>อัปโหลดรูปใหม่</Button>
                                </Upload>
                            )}

                            {selectedPicture && (
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        const foundPic = pictureList.find((pic) => {
                                            const src = pic.url ? `${conf.urlPrefix}${pic.url}` : pic.previewUrl;
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
                        <EditProductForm form={form} product={editingProduct} onUpdate={handleCancel} onCancel={handleCancel} />
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default EditProductModal;
