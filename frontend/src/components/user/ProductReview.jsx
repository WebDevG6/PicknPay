import { Progress } from "antd";

function ProductReview() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="font-semibold text-xl">รีวิวสินค้า</p>
                <div className="flex flex-row items-center gap-4">
                    <p className="font-semibold text-5xl w-[20%]">4.8</p>
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
        </div>
    );
}
export default ProductReview;
