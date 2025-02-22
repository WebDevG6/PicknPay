import { useState, useEffect } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadProductImages = ({ onImageUpload, reset }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (reset) {
            setImages([]);
            onImageUpload([]);
        }
    }, [reset]);

    const handleUpload = ({ file, onSuccess }) => {
        setTimeout(() => {
            const newImages = [...images, file];
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
            <h2 className="text-sm font-semibold mb-2">Upload Product Images</h2>

            <div className="flex gap-3 flex-wrap">
                {images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20">
                        <img src={URL.createObjectURL(img)} alt={`Product ${index + 1}`} className="w-full h-full object-cover rounded-md border cursor-pointer" />
                        <button className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full hover:bg-red-600" onClick={() => removeImage(img)}>✕</button>
                    </div>
                ))}
            </div>

            <Upload customRequest={handleUpload} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
        </div>
    );
};

export default UploadProductImages;
