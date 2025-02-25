import { useState, useCallback, useEffect } from "react";
import { Form, Input, InputNumber, message, Select, Button } from "antd";
import UploadProductImages from "../../components/admin/UploadProductImages";
import CategoryButtons from "../../components/admin/CategoryButtons";
import ax from "../../conf/ax";
import useProducts from "../../hooks/useProducts";
import useEditProductStore from "../../components/admin/useEditProductStore";

const AddProduct = () => {
    const { categories } = useProducts();
    const { brands, fetchBrands } = useEditProductStore();
    const [formData, setFormData] = useState({
        name: "",
        price: null,
        brand: "",
        description: "",
        category: null,
        picture: [],
        stock: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchBrands();
    }, []);


    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleCategorySelect = useCallback((selectedCategoryName) => {
        setFormData((prev) => ({ ...prev, category: selectedCategoryName }));
    }, []);

    const uploadImages = async () => {
        if (formData.picture.length === 0) return [];


        const formDataUpload = new FormData();
        console.log("Uploading files:", formData.picture);

        formData.picture.forEach((file) => {
            formDataUpload.append("files", file.originFileObj || file);
        });

        try {
            const response = await ax.post("/upload", formDataUpload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return response.data.map((file) => file.id);
        } catch (error) {
            console.error("Error uploading images:", error.response?.data || error.message);
            message.error("อัปโหลดรูปภาพล้มเหลว!");
            return [];
        }
    };


    const [resetImages, setResetImages] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) {
            message.warning("กำลังเพิ่มสินค้า กรุณารอสักครู่...");
            return;
        }

        if (!formData.name || !formData.price || !formData.category || !formData.brand || formData.picture.length === 0) {
            message.error("กรุณากรอกข้อมูลให้ครบถ้วน!");
            return;
        }

        setIsSubmitting(true);

        const categoryObj = categories.find((cat) => cat.name.trim() === formData.category.trim());
        const categoryId = categoryObj?.id || null;

        if (!categoryId) {
            message.error("หมวดหมู่ไม่ถูกต้อง!");
            setIsSubmitting(false);
            return;
        }

        const uploadedImageIds = await uploadImages();
        if (uploadedImageIds.length === 0) {
            message.error("อัปโหลดรูปภาพล้มเหลว!");
            console.log(error)
            setIsSubmitting(false);
            return;
        }

        const productData = {
            data: {
                name: formData.name,
                description: formData.description,
                price: formData.price.toString(),
                stock: Number(formData.stock),
                category: { id: categoryId },
                picture: uploadedImageIds,
                brands: { id: formData.brand },
            },
        };

        try {
            await ax.post("/products", productData, {
                headers: { "Content-Type": "application/json" },
            });

            message.success("เพิ่มสินค้าเรียบร้อย!");

            setFormData({
                name: "",
                price: null,
                brand: "",
                description: "",
                category: null,
                picture: [],
                stock: "",
            });

            setResetImages(true);
            setTimeout(() => setResetImages(false), 500);

        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            message.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า!");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="rounded-lg shadow-lg mx-10 my-4 p-8 bg-white">
            <Form layout="vertical">
                <Form.Item label="ชื่อสินค้า">
                    <Input placeholder="ระบุชื่อสินค้า" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                </Form.Item>

                <Form.Item label="ราคา">
                    <InputNumber style={{ width: "100%" }} min={0} max={1000000} placeholder="กรอกราคาสินค้า (บาท)" value={formData.price} onChange={(value) => handleChange("price", value)} />
                </Form.Item>

                <Form.Item label="แบรนด์">
                    <Select
                        placeholder="เลือกแบรนด์สินค้า"
                        options={brands.length > 0 ? brands.map((b) => ({ value: b.id, label: b.name })) : []}
                        onChange={(value) => handleChange("brand", value)}
                        style={{ width: "100%" }}
                        allowClear
                    />
                </Form.Item>

                <Form.Item label="จำนวนคงเหลือ(สต็อก)">
                    <InputNumber style={{ width: "100%" }} min={0} max={10000} placeholder="กรอกจำนวนสินค้าคงเหลือ" value={formData.stock} onChange={(value) => handleChange("stock", value)} />
                </Form.Item>

                <Form.Item label="รายละเอียดสินค้า">
                    <Input.TextArea placeholder="ใส่รายละเอียดสินค้าให้ครบถ้วน" rows={4} value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
                </Form.Item>

                <CategoryButtons handleCategorySelect={handleCategorySelect} selectedCategory={formData.category} />

                <div className="my-10 bg-white">
                    <UploadProductImages onImageUpload={(files) => handleChange("picture", files)} reset={resetImages} />
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    block
                    onClick={handleSubmit}
                >
                    เพิ่มสินค้า
                </Button>
            </Form>
        </div>
    );
};

export default AddProduct;
