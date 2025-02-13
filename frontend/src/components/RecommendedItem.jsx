import React from "react";

function RecommendedItem({ items }) {
    return (
        <div className="bg-blue-600 p-4 rounded-lg shadow-md flex-grow flex flex-col items-center h-full">
            {/* ข้อความหัวข้อ */}
            <h3 className="text-xl font-bold text-white mb-3">Recommended Item</h3>

            {/* กล่อง 3 แถว 1 คอลัมน์ที่ขนาดเท่ากัน */}
            <div className="flex flex-col gap-2 w-full flex-grow">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-gray-100 p-2 rounded-lg shadow-md flex items-center justify-between flex-grow">
                        {/* ข้อความทางซ้าย */}
                        <div className="flex flex-col justify-center">
                            <p className="text-base font-semibold text-gray-800">Title {item}</p>
                            <p className="text-xs text-gray-600">Subtitle {item}</p>
                        </div>
                        {/* รูปภาพทางขวา */}
                        <div className="w-16 h-16 bg-gray-300 rounded-md flex-shrink-0">
                            <img
                                src={`https://via.placeholder.com/64?text=Img+${item}`}
                                alt={`Image ${item}`}
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecommendedItem;