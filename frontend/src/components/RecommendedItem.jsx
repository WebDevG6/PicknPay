import React from "react";
import { useReviews } from "../hooks/query";
import { Link } from "react-router-dom";
function RecommendedItem() {
    const { data: reviews, isLoading, error } = useReviews();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const sortedReviews = [...reviews]
        .filter(review => review.rating)
        .sort((a, b) => Number(b.rating) - Number(a.rating))
        .slice(0, 3);

    return (
        <div className="bg-blue-600 p-3 rounded-md shadow-md w-full max-w-screen-lg mx-auto flex flex-col items-center h-full">
            <h3 className="text-xl font-bold text-white mb-2">สินค้าแนะนำ</h3>

            <div className="flex flex-col gap-2 w-full h-full">
                {sortedReviews.map(review => (
                    <Link key={review.id} to={`/products/${review.product?.id}`} className="w-full">
                        <div className="bg-white px-4 py-3 rounded-md shadow-md flex justify-between items-stretch cursor-pointer transition-transform hover:scale-105 h-24">
                            {/* ข้อความ (Col 1) */}
                            <div className="flex flex-col flex-grow w-2/3 overflow-hidden pr-4 justify-center h-full">
                                <p className="text-sm font-semibold text-black line-clamp-2">
                                    {review.product?.name}
                                </p>
                                <p className="text-xs text-black">
                                    ฿ {Number(review.product?.price).toLocaleString("en-US")}
                                </p>
                            </div>
                            {/* รูป (Col 2) */}
                            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                                <img
                                    src={review.product?.image || "https://via.placeholder.com/80"}
                                    alt={review.product?.name || "Product image"}
                                    className="w-full h-full object-contain rounded-md"
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default RecommendedItem;
