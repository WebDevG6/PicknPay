import React from "react";
import { Carousel } from "antd";

const contentStyle = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};

function ProductCarousel() {
    return (
        <div className="flex flex-col gap-4">
            <Carousel arrows infinite={false}>
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>4</h3>
                </div>
            </Carousel>
            <div>pictures</div>
        </div>
    );
}

export default ProductCarousel;
