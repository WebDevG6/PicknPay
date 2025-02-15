import React from "react";

function RecommendedItem() {
    const data = [
        {
            name: "Tronsmart T7 Mini Portable Speaker Black",
            price: 830,
            imgSrc: "https://th.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw63baedca/JBL_QUANTUM_DUO_HERO_V2_011_Main_x2.png?sw=537&sfrm=png",
        },
        {
            name: "Logitech M240 Silent Wireless Mouse Rose",
            price: 509,
            imgSrc: "https://aulathailand.com/wp-content/uploads/2023/07/2.png",
        },
        {
            name: "AKG P420 Condenser Microphone ",
            price: 13900,
            imgSrc: "https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2024/08/Nubwo%20X700.png",
        },
    ];

    return (
        <div className="bg-[#4169E2] p-4 rounded-md shadow-md flex-grow flex flex-col items-center h-full">
            <h3 className="text-xl font-bold text-white mb-3">Recommended Item</h3>

            <div className="flex flex-col gap-2 w-full flex-grow">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="bg-[#FFFFFF] p-2 rounded-md shadow-md flex items-center justify-between flex-grow"
                    >
                        <div className="flex flex-col justify-center">
                            <p className="text-base font-semibold text-gray-800">{item.name}</p>
                            <p className="text-s text-[#1A3CA2]">฿ {item.price.toLocaleString("en-US")}</p>
                        </div>

                        <div className="w-16 h-16 rounded-md flex-shrink-0">
                            <img src={item.imgSrc} alt={item.title} className="w-full h-full object-cover rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecommendedItem;
