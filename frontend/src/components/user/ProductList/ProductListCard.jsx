import { useNavigate } from "react-router-dom";
import { useMemo, React } from "react";
import { Card } from "antd";
import conf from "../../../conf/main";
import { useReviews } from "../../../hooks/query";

const ProductCard = ({ product }) => {
    const { data: allReviews } = useReviews();
    const navigate = useNavigate();

    const product_discount = product.price;
    const product_amount = product.price - product_discount;
    const discountPercentage = ((product_amount / product.price) * 100).toFixed(0);
    const imageUrl = `${conf.urlPrefix}${product.picture[0].url}`;

    const productReviews = useMemo(() => {
        if (!allReviews || allReviews.length === 0) return [];
        return allReviews.filter(review => review.product?.id === product.id);
    }, [allReviews, product.id]);


    const averageRating = useMemo(() => {
        if (!productReviews || productReviews.length === 0) return 0;
        const total = productReviews.reduce((acc, review) => acc + Number(review.rating), 0);
        return total / productReviews.length;
    }, [productReviews]);

    const getStarColor = (rating) => {
        if (!rating || rating === 0) return "text-gray-400";
        if (rating < 2) return "text-yellow-200";
        if (rating < 3) return "text-yellow-400";
        if (rating < 4) return "text-yellow-500";
        return "text-yellow-600";
    };


    return (
        <Card
            onClick={() => navigate(`/products/${product.id}`)}
            key={product.id}
            hoverable
            className="border border-black shadow-sm hover:shadow-md transition-transform transform hover:scale-102 ease-in-out rounded-lg overflow-hidden"
            cover={
                <div className="relative w-full flex justify-center items-center bg-white p-4 h-36 sm:h-44 md:h-48 lg:h-52 xl:h-60">
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 font-[Kanit] bg-red-500 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-bold shadow-md">
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
            <h1 className=" text-base sm:text-lg md:text-xl text-left font-semibold text-gray-800 truncate">
                {product.name}
            </h1>
            <div className="text-left mt-2">
                {product_discount !== product.price ? (
                    <>
                        <span className="text-base sm:text-lg md:text-lg font-semibold text-black mr-2 truncate">
                            ฿{Number(product_discount).toLocaleString()}
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
                <div className="flex items-center mt-1">
                    <span className={`text-base sm:text-xl md:text-2xl ${getStarColor(averageRating)}`}>★</span>
                    <span className="text-base sm:text-sm md:text-lg text-gray-700 ml-1">{averageRating.toFixed(1)}</span>
                </div>
                <p className="text-left mt-2 truncate">
                    <span className="text-yellow-400 text-sm sm:text-sm md:text-sm">ส่งไวถึงใจ</span>
                </p>
            </div>
        </Card>
    );
};

export default ProductCard;
