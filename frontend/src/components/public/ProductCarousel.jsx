import { useState, useRef } from "react";
import { Carousel, Image } from "antd";
import conf from "@conf/main";

function ProductCarousel({ images }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef(null);

    const handleCarouselChange = (current) => {
        setActiveIndex(current);
    };

    const handleThumbnailClick = (index) => {
        carouselRef.current.goTo(index);
        setActiveIndex(index);
    };

    return (
        <div className="flex flex-col gap-4 justify-center">
            <div className="rounded-md shadow-md overflow-hidden">
                <Carousel ref={carouselRef} arrows afterChange={handleCarouselChange}>
                    {images.map((image) => (
                        <Image key={image.url} src={conf.urlPrefix + image.url} />
                    ))}
                </Carousel>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                    <img
                        key={image.url}
                        src={conf.urlPrefix + image.url}
                        className={`col-span-1 cursor-pointer hover:ring-2 ring-[#4169E2] rounded-md transition w-full h-full object-cover shadow-md ${
                            activeIndex === index ? "ring-2 ring-[#4169E2]" : ""
                        }`}
                        onClick={() => handleThumbnailClick(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ProductCarousel;
