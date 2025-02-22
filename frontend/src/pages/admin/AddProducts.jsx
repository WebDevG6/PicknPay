import { useState } from "react";
import { Form, Input, Upload, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "@headlessui/react";
import { FaHeadphones, FaMouse, FaKeyboard, FaMicrophone, FaDesktop, FaVolumeUp } from "react-icons/fa";
import UploadProductImages from "../../components/admin/UploadProductImages";

// ✅ หมวดหมู่ปุ่ม
const CategoryButtons = ({ handleCategorySelect, selectedCategory }) => {
    const categories = ["headphone", "mouse", "keyboard", "microphone", "computer", "loudspeaker"];
    const categoryIcons = {
        headphone: <FaHeadphones className="w-5 h-5" />,
        mouse: <FaMouse className="w-5 h-5" />,
        keyboard: <FaKeyboard className="w-5 h-5" />,
        microphone: <FaMicrophone className="w-5 h-5" />,
        computer: <FaDesktop className="w-5 h-5" />,
        loudspeaker: <FaVolumeUp className="w-5 h-5" />,
    };

    return (
        <div className="mb-2">
            <h2 className="text-sm sm:text-sm mb-1">Choose categories</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-[2px] sm:gap-2">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex flex-col items-center justify-center gap-[1px] border px-1 py-[2px] sm:px-2 sm:py-1 rounded transition-all w-full
                ${selectedCategory === cat ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-900 border-gray-300"}
                hover:bg-blue-600 hover:text-white hover:border-blue-600`}
                    >
                        <span className="flex-shrink-0 text-[8px] sm:text-[10px]">{categoryIcons[cat]}</span>
                        <span className="text-[7px] sm:text-[9px] md:text-[10px] text-center">{cat}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

const AddProduct = () => {
    const [category, setCategory] = useState(null);

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
    };

    return (
        <div className="rounded-lg shadow-lg mx-10 my-4 p-8 bg-white">
            <Form layout="vertical">
                <Form.Item label="Name">
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item label="Price">
                    <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter price" />
                </Form.Item>

                <Form.Item label="Brand">
                    <Input placeholder="Enter brand" />
                </Form.Item>

                <Form.Item label="Description">
                    <Input.TextArea placeholder="Enter description" rows={4} />
                </Form.Item>

                <CategoryButtons handleCategorySelect={handleCategorySelect} selectedCategory={category} />

                <div className="my-10  bg-white">
                    <UploadProductImages />
                </div>


                <Button
                    className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition-all"
                    onClick={() => console.log("Submitting...", { category })}
                >
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default AddProduct;
