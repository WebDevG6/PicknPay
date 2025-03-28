import { Button } from "@headlessui/react";
import { FaHeadphones, FaMouse, FaKeyboard, FaMicrophone, FaDesktop, FaVolumeUp } from "react-icons/fa";

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
            <h2 className="text-sm sm:text-sm mb-1">เลือกหมวดหมู่</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 px-2 sm:gap-2">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex flex-col items-center justify-center gap-[1px] border px-1 py-4 sm:px-2 sm:py-1 rounded transition-all w-full
                ${
                    selectedCategory === cat
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-600 border-gray-300"
                }
                hover:bg-blue-600 hover:text-white hover:border-blue-600`}
                    >
                        <span className="flex-shrink-0 text-[8px] sm:text-[12px] mt-2">{categoryIcons[cat]}</span>
                        <span className="text-[12px] sm:text-[14px] md:text-[14px] text-center py-1">{cat}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default CategoryButtons;
