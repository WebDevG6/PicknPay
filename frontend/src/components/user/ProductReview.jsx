import { Progress, Rate, Card, Col, Row } from "antd";

function ProductReview() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
                <p className="font-semibold text-xl">รีวิวสินค้า</p>
                <div className="flex flex-row items-center gap-4">
                    <div className="flex flex-col gap-6 w-[20%] items-center">
                        <p className="font-semibold text-5xl">4.8</p>
                        <Rate disabled allowHalf value={4.8} />
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
                    <Col span={8}>
                        <Card
                            title={
                                <div className="flex flex-row justify-between items-center py-3">
                                    <div className="flex flex-col gap-2">
                                        <p>Card title</p>
                                        <Rate
                                            disabled
                                            value={4}
                                            style={{ fontSize: 15 }}
                                        />
                                    </div>
                                    <p className="font-normal text-sm">
                                        01/03/25
                                    </p>
                                </div>
                            }
                        >
                            <p className="text-base">ตัวอย่างคอมเมนต์</p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Card title">Card content</Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Card title">Card content</Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
export default ProductReview;
