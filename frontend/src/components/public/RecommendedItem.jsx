import { Link } from "react-router";
import useProducts from "@hooks/useProducts";
import conf from "@conf/main";
import { Spin } from "antd";

function RecommendedItem() {
    const { products, productsLoading } = useProducts();

    const sortedReviews = [...products]
        .sort((a, b) => {
            const averageRating = (product) => {
                return (
                    product.reviews.reduce((acc, review) => acc + Number(review.rating), 0) / product.reviews.length ||
                    0
                );
            };
            return Number(averageRating(b) - averageRating(a));
        })
        .slice(0, 3);

    return (
        <Spin spinning={productsLoading}>
            <div className="bg-blue-600 p-3 rounded-md shadow-md w-full max-w-screen-lg mx-auto flex flex-col items-center h-full">
                <h3 className="text-xl font-bold text-white mb-2">สินค้าแนะนำ</h3>

                <div className="flex flex-col gap-2 w-full h-full">
                    {sortedReviews.map((product) => (
                        <Link key={product.id} to={`/products/${product.id}`} className="w-full">
                            <div className="bg-white px-4 py-3 rounded-md shadow-md flex justify-between items-stretch cursor-pointer transition-transform hover:scale-105 h-24">
                                <div className="flex flex-col flex-grow w-2/3 overflow-hidden pr-4 justify-center h-full">
                                    <p className="text-sm font-semibold text-black line-clamp-2">{product.name}</p>
                                    {Number(product.discountAmount) !== 0 ? (
                                        <div className="flex flex-row gap-1 items-center">
                                            <div className=" bg-red-500 text-white px-2.5 py-1 rounded-md font-semibold text-xs">
                                                ลด {((product.discountAmount / product.price) * 100).toFixed(0)}%
                                            </div>
                                            <p className="text-base text-black font-semibold">
                                                ฿{(product.price - product.discountAmount).toLocaleString("en-US")}
                                            </p>

                                            <p className="line-through text-gray-500 text-xs">
                                                ฿{product.price.toLocaleString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-base text-black">฿{product.price.toLocaleString("en-US")}</p>
                                    )}
                                </div>
                                <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                                    <img
                                        src={conf.urlPrefix + product.picture[0].formats.small.url}
                                        alt={product.name || "Product image"}
                                        className="w-full h-full object-contain rounded-md"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Spin>
    );
}

export default RecommendedItem;
