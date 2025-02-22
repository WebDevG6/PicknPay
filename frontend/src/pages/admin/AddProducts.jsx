import { useState, useCallback } from "react";
import { Form, Input, InputNumber, message } from "antd";
import { Button } from "@headlessui/react";
import UploadProductImages from "../../components/admin/UploadProductImages";
import CategoryButtons from "../../components/admin/CategoryButtons";
import ax from "../../conf/ax";
import useProducts from "../../hooks/useProducts";

const AddProduct = () => {
    const { categories } = useProducts();
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

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleCategorySelect = useCallback((selectedCategoryName) => {
        setFormData((prev) => ({ ...prev, category: selectedCategoryName }));
    }, []);

    const uploadImages = async () => {
        if (formData.picture.length === 0) return [];

        const formDataUpload = new FormData();
        formData.picture.forEach((file) => formDataUpload.append("files", file));

        try {
            const response = await ax.post("/upload", formDataUpload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return response.data.map((file) => file.id);
        } catch (error) {
            console.error("Error uploading images:", error.response?.data || error.message);
            return [];
        }
    };
    const getOrCreateBrand = async (brandName) => {
        try {
            const response = await ax.get("/brands");
            const existingBrand = response.data.data.find(
                (brand) => brand.brandname.toLowerCase() === brandName.toLowerCase()
            );

            if (existingBrand) {
                return existingBrand.id;
            }

            const newBrandResponse = await ax.post("/brands", {
                data: { brandname: brandName },
            });

            return newBrandResponse.data.data.id;
        } catch (error) {
            console.error("Error fetching/creating brand:", error.response?.data || error.message);
            return null;
        }
    };

    const [resetImages, setResetImages] = useState(false);

    const handleSubmit = async () => {
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
            setIsSubmitting(false);
            return;
        }

        const brandId = await getOrCreateBrand(formData.brand);
        if (!brandId) {
            message.error("ไม่สามารถสร้าง/อัปเดตแบรนด์ได้!");
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
                brands: { id: brandId },
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
                <Form.Item label="Name">
                    <Input placeholder="Enter product name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                </Form.Item>

                <Form.Item label="Price">
                    <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter price" value={formData.price} onChange={(value) => handleChange("price", value)} />
                </Form.Item>

                <Form.Item label="Brand">
                    <Input placeholder="Enter brand" value={formData.brand} onChange={(e) => handleChange("brand", e.target.value)} />
                </Form.Item>

                <Form.Item label="Stock">
                    <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter stock" value={formData.stock} onChange={(value) => handleChange("stock", value)} />
                </Form.Item>

                <Form.Item label="Description">
                    <Input.TextArea placeholder="Enter description" rows={4} value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
                </Form.Item>

                <CategoryButtons handleCategorySelect={handleCategorySelect} selectedCategory={formData.category} />

                <div className="my-10 bg-white">
                    <UploadProductImages onImageUpload={(files) => handleChange("picture", files)} reset={resetImages} />
                </div>

                <Button
                    className={`w-full bg-blue-500 text-white font-medium py-2 rounded-md transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </Form>
        </div>
    );
};

export default AddProduct;
