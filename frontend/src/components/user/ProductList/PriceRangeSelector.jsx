import React, { useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { Input, Slider } from "antd";
import usePriceStore from "./usePriceStore";

const PriceRangeSelector = () => {
    const price = usePriceStore((state) => state.price);
    const setPrice = usePriceStore((state) => state.setPrice);

    const handleSliderChange = (newValue) => {
        setPrice(newValue);
    };

    const handleMinChange = (e) => {
        const newMin = Math.max(0, Math.min(Number(e.target.value), price[1]));
        setPrice([newMin, price[1]]);
    };

    const handleMaxChange = (e) => {
        const newMax = Math.max(price[0], Math.min(Number(e.target.value), 100000));
        setPrice([price[0], newMax]);
    };
    return (
        <div className="flex flex-col items-center gap-4 w-full p-4">
            <RangeSlider
                min={0}
                max={100000}
                step={100}
                rangeSlideDisabled={true}
                value={price}
                onInput={handleSliderChange}
                className="w-full max-w-lg size-1"
            />
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-start gap-1">
                    <span className=" text-gray-500 text-sm font-[Kanit]">ต่ำสุด</span>
                    <Input
                        type="number"
                        value={price[0]}
                        onChange={handleMinChange}
                        className="w-32 text-lg font-semibold"
                        prefix="฿"
                    />
                </div>
                <span className="text-xl font-semibold mt-4 text-gray-500">-</span>
                <div className="flex flex-col items-start gap-1">
                    <span className="text-gray-500 text-sm font-[Kanit]">สูงสุด</span>
                    <Input
                        type="number"
                        value={price[1]}
                        onChange={handleMaxChange}
                        className="w-32 text-lg font-semibold"
                        prefix="฿"
                    />
                </div>
            </div>
        </div>
    );
};

export default PriceRangeSelector;
