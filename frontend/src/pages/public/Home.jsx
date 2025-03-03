import React from "react";
import { Link } from "react-router";
import CarouselHome from "@components/public/CarouselHome";
import RecommendedItem from "@components/public/RecommendedItem";

const categories = [
    {
        name: "หูฟัง",
        image: "https://hecategaming.com/cdn/shop/files/G5BT_CAT_Headphone_product_pictures_black_3.webp?v=1710926776&width=2048",
        path: "/products/?category=headphone",
    },
    {
        name: "เมาส์",
        image: "https://aulathailand.com/wp-content/uploads/2023/07/2.png",
        path: "/products/?category=mouse",
    },
    {
        name: "คีย์บอร์ด",
        image: "https://logitech.e-express.co.th/wp-content/uploads/2024/05/p1.webp",
        path: "/products/?category=keyboard",
    },
    {
        name: "ไมโครโฟน",
        image: "https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2024/08/Nubwo%20X700.png",
        path: "/products/?category=microphone",
    },
    {
        name: "คอมพิวเตอร์",
        image: "https://i02.appmifile.com/456_item_th/18/03/2024/115d7e9c8cfc2f2d02c6b7064313ffcf!400x400!85.png",
        path: "/products/?category=computer",
    },
    {
        name: "ลำโพง",
        image: "https://th.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw63baedca/JBL_QUANTUM_DUO_HERO_V2_011_Main_x2.png?sw=537&sfrm=png",
        path: "/products/?category=loudspeaker",
    },
];

function Home() {
    return (
        <div className="w-full max-w-none">
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((item, index) => (
                        <Link key={index} to={item.path}>
                            <div className="bg-[#FFFFFF] p-6 rounded-md shadow-md flex flex-col items-center cursor-pointer transition-transform hover:scale-105">
                                <img src={item.image} alt={item.name} className="w-24 h-24 mb-2 object-contain" />
                                <p className="text-lg font-semibold text-[#483BA2] font-[Kanit]">{item.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                    <div className="lg:col-span-1 flex flex-col h-full ">
                        <RecommendedItem />
                    </div>

                    <div className="lg:col-span-2 flex flex-col h-full rounded-md overflow-hidden">
                        <CarouselHome className="flex-grow h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
