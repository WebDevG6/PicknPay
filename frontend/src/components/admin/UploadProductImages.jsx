import { useState, useEffect } from "react";
import { Upload, Button, Modal, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const UploadProductImages = ({ onImageUpload, reset }) => {
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const MAX_IMAGES = 5;

    useEffect(() => {
        if (reset) {
            setFileList([]);
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

        if (fileList.length >= MAX_IMAGES) {
            message.error(`คุณสามารถอัปโหลดได้สูงสุด ${MAX_IMAGES} รูปเท่านั้น!`);
            return;
        }

        setTimeout(() => {
            const newFile = {
                uid: file.uid,
                name: file.name,
                status: "done",
                url: URL.createObjectURL(file),
                originFileObj: file,
            };
            const newFileList = [...fileList, newFile].slice(0, MAX_IMAGES);
            setFileList(newFileList);
            onImageUpload(newFileList);
            onSuccess("done");
        }, 1000);
    };

    const handleRemove = (file) => {
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        setFileList(newFileList);
        onImageUpload(newFileList);
    };

    const handlePreview = async (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewVisible(true);
    };

    return (
        <div className="w-full">
            <h2 className="text-sm mb-2">อัปโหลดรูปภาพสินค้า (สูงสุด {MAX_IMAGES} รูป)</h2>

            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onRemove={handleRemove}
                customRequest={handleUpload}
                accept="image/png, image/jpeg, image/jpg"
                showUploadList={{
                    showRemoveIcon: true,
                    removeIcon: <DeleteOutlined style={{ color: "red" }} />,
                }}
            >
                {fileList.length < MAX_IMAGES && (
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                )}
            </Upload>

            <Modal
                open={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default UploadProductImages;
