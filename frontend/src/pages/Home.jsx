import React from "react";
import Carousel from "../components/Carousel";
import RecommendedItem from "../components/RecommendedItem";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Home() {
    return (
        <div className="w-full max-w-none">
            <div className="container mx-auto p-4">
                {/* Grid สำหรับแสดงหมวดหมู่ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { name: "หูฟัง", image: "https://hecategaming.com/cdn/shop/files/G5BT_CAT_Headphone_product_pictures_black_3.webp?v=1710926776&width=2048", path: "/categories/headphone" },
                        { name: "เมาส์", image: "https://aulathailand.com/wp-content/uploads/2023/07/2.png", path: "/categories/mouse" },
                        { name: "คีย์บอร์ด", image: "https://logitech.e-express.co.th/wp-content/uploads/2024/05/p1.webp", path: "/categories/keyboard" },
                        { name: "ไมโครโฟน", image: "https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2024/08/Nubwo%20X700.png", path: "/categories/microphone" },
                        { name: "จอคอม", image: "https://i02.appmifile.com/456_item_th/18/03/2024/115d7e9c8cfc2f2d02c6b7064313ffcf!400x400!85.png", path: "/categories/computer" },
                        { name: "ลำโพง", image: "https://th.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw63baedca/JBL_QUANTUM_DUO_HERO_V2_011_Main_x2.png?sw=537&sfrm=png", path: "/categories/loudspeaker" },
                    ].map((item, index) => (
                        <Link key={index} to={item.path}> {/* คลุม Card ด้วย Link */}
                            <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer transition-transform hover:scale-105">
                                <img src={item.image} alt={item.name} className="w-24 h-24 mb-2 object-contain" />
                                <p className="text-lg font-bold text-[#4169E2]">{item.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 mt-6">
                    {/* กล่องสีน้ำเงิน */}
                    <div className="lg:col-span-1 flex flex-col h-full ">
                        <RecommendedItem />
                    </div>

                    {/* Carousel */}
                    <div className="lg:col-span-2 flex flex-col h-full">
                        <Carousel className="flex-grow h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;