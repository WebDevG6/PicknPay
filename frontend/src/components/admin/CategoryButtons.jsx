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
            <h2 className="text-sm sm:text-sm mb-1">Choose categories</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-[2px] sm:gap-2">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex flex-col items-center justify-center gap-[1px] border px-1 py-[2px] sm:px-2 sm:py-1 rounded transition-all w-full
                ${selectedCategory === cat ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300"}
                hover:bg-blue-600 hover:text-white hover:border-blue-600`}
                    >
                        <span className="flex-shrink-0 text-[6px] sm:text-[8px]">{categoryIcons[cat]}</span>
                        <span className="text-[6px] sm:text-[12px] md:text-[14px] text-center">{cat}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default CategoryButtons;
