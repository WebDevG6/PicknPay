import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, message } from "antd";
import useProducts from "../../hooks/useProducts";
import useEditProductStore from "./useEditProductStore";
import ax from "../../conf/ax";
import conf from "../../conf/main";

message.config({
    maxCount: 2,
})

const EditProductForm = ({ form, product, onUpdate, onCancel }) => {
    const { categories, refetchProducts } = useProducts();
    const useEditProduct = useEditProductStore();
    const { setEditingProduct, loading, setLoading, pictureList, brands, fetchBrands } = useEditProduct;
    const [formValues, setFormValues] = useState({});


    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        if (product) {
            const initialData = {
                name: product.name || "",
                price: product.price || 0,
                stock: product.stock || 0,
                description: product.description || "",
                category: product.category?.id || null,
                brand: product.brands?.id || null,
            };
            setFormValues(initialData);
            form.setFieldsValue(initialData);
        }
    }, [product, form]);

    useEffect(() => {
        if (!product) {
            setFormValues({});
            form.resetFields();
        }
    }, [product, form]);


    const handleUpdate = async () => {
        try {
            if (loading) {
                message.warning("กำลังดำเนินการ กรุณารอสักครู่...");
                return;
            }
            const values = await form.validateFields();
            setLoading(true);

            if (pictureList.length === 0) {
                message.error("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป!");
                setLoading(false);
                return;
            }

            if (!values.brand) {
                message.error("กรุณาเลือกแบรนด์ให้ถูกต้อง!");
                setLoading(false);
                return;
            }

            if (brands.length === 0) {
                message.error("กำลังโหลดข้อมูลแบรนด์ กรุณาลองใหม่!");
                setLoading(false);
                return;
            }

            let selectedBrand;

            if (typeof values.brand === "number") {
                selectedBrand = brands.find((b) => b.id === values.brand);
            } else if (typeof values.brand === "string") {
                const brandExists = brands.some((b) => b.name.toLowerCase() === values.brand.toLowerCase());
                if (!brandExists) {
                    message.error("แบรนด์ที่คุณกรอกไม่มีอยู่ในระบบ กรุณาเลือกจากรายการ!");
                    setLoading(false);
                    return;
                }
                selectedBrand = brands.find((b) => b.name.toLowerCase() === values.brand.toLowerCase());
            }

            if (!selectedBrand) {
                message.error("แบรนด์ไม่ถูกต้อง!");
                setLoading(false);
                return;
            }

            let uploadedIds = [];
            let oldIds = pictureList.filter((p) => p.id).map((p) => p.id);

            for (const pic of pictureList) {
                if (!pic.id && pic.originFileObj) {
                    const formData = new FormData();
                    formData.append("files", pic.originFileObj);

                    try {
                        const response = await ax.post(`${conf.apiUrlPrefix}/upload`, formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                        });

                        if (response.data?.length > 0) {
                            uploadedIds.push(response.data[0].id);
                        }
                    } catch (uploadError) {
                        console.error("Upload Failed:", uploadError);
                        message.error("อัปโหลดรูปภาพล้มเหลว!");
                        setLoading(false);
                        return;
                    }
                }
            }


            const allImageIds = [...oldIds, ...uploadedIds];

            const productData = {
                data: {
                    name: values.name,
                    description: values.description,
                    price: values.price.toString(),
                    stock: Number(values.stock),
                    category: { id: values.category },
                    picture: allImageIds,
                    brands: { id: selectedBrand.brand },
                },
            };

            const response = await ax.put(`/products/${product.documentId}?populate=*`, productData);

            if (response.data.data) {
                setEditingProduct(response.data.data);
                message.success("อัปเดตสินค้าสำเร็จ!");
                onUpdate();
                refetchProducts()
            } else {
                message.error("อัปเดตสินค้าไม่สำเร็จ!");
            }
        } catch (error) {
            console.error("Update Failed:", error);
            message.error("อัปเดตสินค้าล้มเหลว!");
            console.log(error)
        } finally {
            setLoading(false);
        }
    };



    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={formValues}
            onValuesChange={(changedValues, allValues) => {
                setFormValues(allValues);
                form.setFieldsValue(allValues);
            }}
        >
            <Form.Item label="ชื่อสินค้า" name="name" rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}>
                <Input maxLength={1000} />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item label="ราคา" name="price" rules={[{ required: true, message: "กรุณากรอกราคา" }]}>
                    <InputNumber min={0} max={1000000} className="w-full" />
                </Form.Item>
                <Form.Item label="จำนวนสต็อก" name="stock" rules={[{ required: true, message: "กรุณากรอกจำนวนสต็อก" }]}>
                    <InputNumber min={0} max={10000} className="w-full" />
                </Form.Item>
                <Form.Item label="แบรนด์" name="brand" rules={[{ required: true, message: "กรุณาเลือกแบรนด์" }]}>
                    <Select
                        placeholder="เลือกแบรนด์สินค้า"
                        options={brands.map((b) => ({ value: b.id, label: b.name }))}
                    />
                </Form.Item>
            </div>

            <Form.Item label="หมวดหมู่" name="category" rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}>
                <Select placeholder="เลือกหมวดหมู่">
                    {categories.map((cat) => (
                        <Select.Option key={cat.id} value={cat.id}>
                            {cat.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="คำอธิบายสินค้า" name="description" >
                <Input.TextArea rows={4} maxLength={10000} />
            </Form.Item>

            <div className="flex justify-end gap-2">
                <Button onClick={onCancel}>ยกเลิก</Button>
                <Button type="primary" onClick={handleUpdate} loading={loading}>
                    บันทึกการเปลี่ยนแปลง
                </Button>
            </div>
        </Form>
    );
};

export default EditProductForm;
