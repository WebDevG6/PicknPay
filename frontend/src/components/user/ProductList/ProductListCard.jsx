import { useNavigate } from "react-router-dom";
import React from "react";
import { Card } from "antd";


const ProductCard = ({ product }) => {
    const product_discount = product.price;
    const product_amount = product.price - product_discount;
    const discountPercentage = ((product_amount / product.price) * 100).toFixed(0);
    const imageUrl = `http://localhost:1337${product.images[0].url}`
    const navigate = useNavigate()
    Number(product_discount).toLocaleString();
    Number(product.price).toLocaleString();

    return (
        <Card
            // onClick={() => navigate(`/product/${product.id}`)}
            // key={product.id}
            hoverable
            className="border shadow-md hover:shadow-lg transition-transform transform hover:scale-103 rounded-lg overflow-hidden"
            cover={
                <div className="relative w-full flex justify-center items-center bg-white p-4 h-36 sm:h-44 md:h-48 lg:h-52 xl:h-60">
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 font-[Kanit] bg-red-500 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-bold shadow-md">
                            ลด {discountPercentage}%
                        </div>
                    )}
                    <div className="flex justify-center items-center w-full h-full">
                        <img
                            alt={product.name}
                            src={imageUrl}
                            className="max-w-full max-h-full object-contain rounded-md"
                        />
                    </div>
                </div>
            }
        >
            <h1 className="font-[Kanit] text-sm sm:text-base md:text-lg font-semibold text-left text-gray-800 truncate">{product.name}</h1>
            <p className="text-left mt-2">
                {product_discount !== product.price ? (
                    <>
                        <span className="font-[Kanit] text-base sm:text-lg md:text-lg font-bold text-black mr-2 truncate">
                            ฿{Number(product_discount).toLocaleString()}
                        </span>
                        <span className="font-[Kanit] line-through text-gray-500 text-xs sm:text-sm md:text-sm truncate">
                            ฿{Number(product.price).toLocaleString()}
                        </span>
                    </>
                ) : (
                    <span className="font-[Kanit] text-base sm:text-lg md:text-lg font-bold text-black truncate">
                        ฿{Number(product.price).toLocaleString()}
                    </span>
                )}
                <p className="font-[Kanit] text-left mt-3.5 truncate">
                    <span className="text-yellow-300 text-xs sm:text-sm md:text-sm">
                        ส่งไวถึงใจ
                    </span>
                </p>
            </p>
        </Card>
    );
};

export default ProductCard;
