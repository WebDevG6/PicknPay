import { useNavigate } from "react-router-dom";
import React from "react";
import { Card, Rate } from "antd";
import conf from "../../../conf/main";

const ProductCard = ({ product }) => {
    const productAmount = Number(product.price - product.discountAmount);
    const discountPercentage = ((productAmount / product.price) * 100).toFixed(0);
    const imageUrl = `${conf.urlPrefix}${product.picture[0].url}`;
    const navigate = useNavigate();

    const averageReview =
        product.reviews?.reduce((acc, review) => {
            return acc + Number(review.rating);
        }, 0) / product.reviews?.length || 0;

    return (
        <Card
            onClick={() => navigate(`/products/${product.id}`)}
            key={product.id}
            hoverable
            className="border border-black shadow-sm hover:shadow-md transition-transform transform hover:scale-102 ease-in-out rounded-lg overflow-hidden"
            cover={
                <div className="relative w-full flex justify-center items-center bg-white p-4 h-36 sm:h-44 md:h-48 lg:h-52 xl:h-60">
                    {discountPercentage < 100 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-semiblod shadow-md z-40">
                            ลด {discountPercentage}%
                        </div>
                    )}
                    <div className="w-full h-full overflow-hidden">
                        <img
                            alt={product.name}
                            src={imageUrl}
                            className="absolute inset-0 w-full h-full object-contain rounded-md transition-transform duration-600 ease-in-out hover:scale-118"
                        />
                    </div>
                </div>
            }
        >
            <h1 className="text-sm sm:text-base md:text-lg font-semibold text-left text-gray-800 truncate">
                {product.name}
            </h1>
            <div className="text-left mt-2">
                {discountPercentage < 100 ? (
                    <>
                        <span className="text-base sm:text-lg md:text-lg font-bold text-black mr-2 truncate">
                            ฿{productAmount.toLocaleString()}
                        </span>
                        <span className="line-through text-gray-500 text-xs sm:text-sm md:text-sm truncate">
                            ฿{Number(product.price).toLocaleString()}
                        </span>
                    </>
                ) : (
                    <span className="text-base sm:text-lg md:text-xl font-bold text-black truncate">
                        ฿{Number(product.price).toLocaleString()}
                    </span>
                )}
                <div className="text-left mt-3.5 truncate flex flex-row gap-2 items-center">
                    <Rate allowHalf disabled value={averageReview} style={{ fontSize: 16 }} />
                    <p className="text-sm">({product.reviews.length})</p>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;
