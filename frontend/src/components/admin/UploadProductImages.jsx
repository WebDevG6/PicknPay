import { useState } from "react";
import { Upload, Button, message, Modal } from "antd";
import { UploadOutlined, ZoomInOutlined, CloseOutlined, StarOutlined } from "@ant-design/icons";

const UploadProductImages = () => {
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null); // ✅ Modal สำหรับ Zoom รูป

    // ✅ อัปโหลดรูป
    const handleUpload = ({ file, onSuccess }) => {
        setTimeout(() => {
            const imageUrl = URL.createObjectURL(file);
            if (!mainImage) {
                setMainImage(imageUrl);
            } else if (additionalImages.length < 5) {
                setAdditionalImages([...additionalImages, imageUrl]);
            } else {
                message.warning("You can only upload up to 5 additional images.");
            }
            onSuccess("done");
        }, 1000);
    };

    // ✅ เปลี่ยนรูปหลัก (Main Image)
    const setAsMainImage = (image) => {
        const newAdditionalImages = mainImage ? [mainImage, ...additionalImages.filter((img) => img !== image)] : additionalImages;
        setMainImage(image);
        setAdditionalImages(newAdditionalImages);
    };

    // ✅ ลบรูป
    const removeImage = (image) => {
        setAdditionalImages(additionalImages.filter((img) => img !== image));
    };

    return (
        <div className="w-full">
            <h2 className="text-sm font-semibold mb-2">Upload Product Image</h2>

            {mainImage && (
                <div className="mb-3 flex justify-start">
                    <div className="relative w-48 h-48 border rounded-md overflow-hidden">
                        <img
                            src={mainImage}
                            alt="Main Product"
                            className="w-full h-full object-cover"
                            onClick={() => setPreviewImage(mainImage)}
                        />
                        <button
                            className="absolute top-2 right-2 bg-black text-white text-xs p-1 rounded-full opacity-70 hover:opacity-100"
                            onClick={() => setPreviewImage(mainImage)}
                        >
                            <ZoomInOutlined />
                        </button>
                    </div>
                </div>

            )
            }
            <div className="mb-3">
                <h2 className="text-xs text-gray-500">Additional Images</h2>
                <div className="flex gap-3 flex-wrap">
                    {additionalImages.map((img, index) => (
                        <div key={index} className="relative w-20 h-20">
                            <img
                                src={img}
                                alt={`Additional ${index + 1}`}
                                className="w-full h-full object-cover rounded-md border cursor-pointer"
                                onClick={() => setAsMainImage(img)}
                            />
                            <button
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full hover:bg-red-600"
                                onClick={() => removeImage(img)}
                            >
                                <CloseOutlined style={{ fontSize: "12px" }} />
                            </button>
                            <button
                                className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs p-1 rounded-full hover:bg-blue-600"
                                onClick={() => setAsMainImage(img)}
                            >
                                <StarOutlined style={{ fontSize: "12px" }} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Upload customRequest={handleUpload} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            <Modal
                open={!!previewImage}
                footer={null}
                onCancel={() => setPreviewImage(null)}
                centered
                className="relative"
            >
                <img src={previewImage} alt="Preview" className="w-full h-auto" />
            </Modal>

        </div >
    );
};

export default UploadProductImages;
