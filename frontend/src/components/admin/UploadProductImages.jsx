import { useState, useEffect } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadProductImages = ({ onImageUpload, reset }) => {
    const [images, setImages] = useState([]);
    const MAX_IMAGES = 5;

    useEffect(() => {
        if (reset) {
            setImages([]);
            onImageUpload([]);
        }
    }, [reset]);

    const isValidImage = (file) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        return allowedTypes.includes(file.type);
    };

    const handleUpload = ({ file, onSuccess }) => {
        if (!isValidImage(file)) {
            message.error("อัปโหลดได้เฉพาะไฟล์ PNG, JPG, JPEG เท่านั้น!");
            return;
        }

        if (images.length >= MAX_IMAGES) {
            message.error(`คุณสามารถอัปโหลดได้สูงสุด ${MAX_IMAGES} รูปเท่านั้น!`);
            return;
        }

        setTimeout(() => {
            const newImages = [...images, file].slice(0, MAX_IMAGES);
            setImages(newImages);
            onImageUpload(newImages);
            onSuccess("done");
        }, 1000);
    };

    const removeImage = (image) => {
        const newImages = images.filter((img) => img !== image);
        setImages(newImages);
        onImageUpload(newImages);
    };

    return (
        <div className="w-full">
            <h2 className="text-sm mb-2">อัปโหลดรูปภาพสินค้า (สูงสุด {MAX_IMAGES} รูป)</h2>

            <div className="flex gap-3 flex-wrap">
                {images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden shadow-md">
                        <img
                            src={URL.createObjectURL(img)}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            className="absolute top-2 right-2 bg-red-500 text-white text-sm w-6 h-6 flex items-center justify-center rounded-full shadow-md transition-all duration-200 hover:bg-red-600 hover:scale-110"
                            onClick={() => removeImage(img)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {images.length < MAX_IMAGES && (
                <Upload customRequest={handleUpload} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
            )}
        </div>
    );
};

export default UploadProductImages;
