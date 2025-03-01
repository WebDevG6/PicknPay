import { Progress, Rate, Card, Col, Row } from "antd";
import dayjs from "dayjs";

function ProductReview({ reviews }) {
    const averageReview =
        reviews?.reduce((acc, review) => {
            return acc + Number(review.rating);
        }, 0) / reviews?.length || 0;
    console.log(averageReview);
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
                <p className="font-semibold text-xl">รีวิวสินค้า</p>
                <div className="flex flex-row items-center gap-4">
                    <div className="flex flex-col gap-6 w-[20%] items-center">
                        <p className="font-semibold text-5xl">
                            {averageReview.toFixed(1)}
                        </p>
                        <Rate disabled allowHalf value={averageReview} />
                    </div>
                    <div className="flex flex-col gap-1 w-[50%]">
                        <div className="flex flex-row items-center gap-2 ">
                            <p className="w-2.5">5</p>
                            <Progress percent={30} showInfo={false} />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <p className="w-2.5">4</p>
                            <Progress percent={30} showInfo={false} />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <p className="w-2.5">3</p>
                            <Progress percent={30} showInfo={false} />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <p className="w-2.5">2</p>
                            <Progress percent={30} showInfo={false} />
                        </div>
                        <div className="flex flex-row items-center gap-2 ">
                            <p className="w-2.5">1</p>
                            <Progress percent={30} showInfo={false} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <p className="font-semibold text-xl">รีวิวล่าสุด</p>
                <Row gutter={16}>
                    {reviews?.map((item) => (
                        <Col span={8}>
                            <Card
                                title={
                                    <div className="flex flex-row justify-between items-center py-3">
                                        <div className="flex flex-col gap-2">
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
