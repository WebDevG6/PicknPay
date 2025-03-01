import { Progress, Rate, Card, Col, Row } from "antd";
import dayjs from "dayjs";

function ProductReview({ reviews }) {
    const averageReview =
        reviews?.reduce((acc, review) => {
            return acc + Number(review.rating);
        }, 0) / reviews?.length || 0;
    const ratingProgress = (rating) => {
        const ratingCount = reviews?.filter(
            (review) => Number(review.rating) === rating
        ).length;
        const percentage = (ratingCount / reviews?.length) * 100;
        return percentage;
    };
    const arrayProgress = [5, 4, 3, 2, 1].map((rating) => {
        return {
            rating: rating,
            percentage: ratingProgress(rating),
        };
    });
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
                <p className="font-semibold text-xl">รีวิวสินค้า</p>
                <div className="flex flex-row items-center gap-4 justify-between">
                    <div className="flex flex-col gap-6 w-[20%] items-center">
                        <p className="font-semibold text-5xl">
                            {averageReview.toFixed(1)}
                        </p>
                        <Rate disabled allowHalf value={averageReview} />
                    </div>
                    <div className="flex flex-col gap-1 w-[50%]">
                        {arrayProgress.map((item) => (
                            <div className="flex flex-row items-center gap-2">
                                <p className="w-2.5">{item.rating}</p>
                                <Progress
                                    percent={item.percentage}
                                    showInfo={false}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-6 w-[20%] items-center">
                        <p className="font-semibold text-5xl">
                            {reviews?.length}
                        </p>
                        <p className="font-semibold text-xl">รีวิว</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <p className="font-semibold text-xl">รีวิวล่าสุด</p>
                <Row gutter={[16, 16]}>
                    {reviews?.map((item) => (
                        <Col span={8}>
                            <Card
                                title={
                                    <div className="flex flex-row justify-between items-center py-3">
                                        <div className="flex flex-col gap-2">
                                            <p className="font-medium text-base">
                                                {item.displayName}
                                            </p>
                                            <Rate
                                                disabled
                                                value={item.rating}
                                                style={{ fontSize: 15 }}
                                            />
                                        </div>
                                        <p className="font-normal text-sm">
                                            {dayjs(item.createdAt).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </p>
                                    </div>
                                }
                            >
                                <p className="text-base">{item.comment}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}
export default ProductReview;
