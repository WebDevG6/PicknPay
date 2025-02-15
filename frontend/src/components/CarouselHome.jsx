import React, { useState } from "react";
import { Carousel } from "antd";

const images = [
    "https://cdn.mercular.com/images/homepage/sections/8/spaces/11/1736941490411_1000067490.jpg",
    "https://cdn.mercular.com/images/homepage/sections/8/spaces/11/1733912345023_6Headphone-(1).jpg",
    "https://cdn.mercular.com/images/homepage/sections/8/spaces/11/1710849795305_Mercular_Store_Homepage.jpg",
];

export default function CarouselHome() {
    return (
        <div className="relative w-full h-full">
            <Carousel arrows autoplay>
                {images.map((image) => (
                    <img key={image} src={image} className="object-fill h-full" />
                ))}
            </Carousel>
        </div>
    );
}
