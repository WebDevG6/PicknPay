import React from "react";
import { useReviews } from "../hooks/query";

function RecommendedItem() {
    const { data: reviews, isLoading, error } = useReviews();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // คัดกรองและเรียงข้อมูลรีวิวจาก rating สูงไปต่ำ
    const sortedReviews = [...reviews]
        .filter(review => review.rating) // กรองเฉพาะรีวิวที่มี rating
        .sort((a, b) => Number(b.rating) - Number(a.rating)) // เรียงจากมากไปน้อย
        .slice(0, 3); // เอาแค่ 3 อันดับแรก

    return (
        <div className="bg-[#4169E2] p-4 rounded-md shadow-md flex-grow flex flex-col items-center h-full">
            <h3 className="text-xl font-bold text-white mb-3">Recommended Items</h3>

            <div className="flex flex-col gap-2 w-full flex-grow">
                {sortedReviews.map((review, index) => (
                    <div
                        key={index}
                        className="bg-[#FFFFFF] p-2 rounded-md shadow-md flex items-center justify-between flex-grow"
                    >
                        <div className="flex flex-col justify-center">
                            <p className="text-base font-semibold text-gray-800">{review.product.name}</p>
                            <p className="text-s text-[#1A3CA2]">฿ {Number(review.product.price).toLocaleString("en-US")}</p>
                        </div>

                        <div className="w-16 h-16 rounded-md flex-shrink-0">
                            <img
                                src="https://via.placeholder.com/64" // ควรเปลี่ยนเป็นรูปสินค้าจริง ถ้ามีข้อมูล
                                alt={review.product.name}
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
