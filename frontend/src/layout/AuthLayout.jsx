import React from "react";
import { Outlet } from "react-router";
import { ConfigProvider, Carousel } from "antd";

export default function AuthLayout() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "Poppins",
                    colorPrimary: "#4169E2",
                },
            }}
        >
            <div className="h-screen w-screen inline-flex bg-white">
                <p className="text-4xl font-bold absolute ml-20 mt-8 font-[Koulen] tracking-wide text-[#122C76]">
                    PICK&PAY
                </p>
                <div className="w-[60%] flex flex-col items-center justify-center">
                    <Outlet />
                </div>
                <div className="w-[40%] h-full">
                    <Carousel autoplay className="h-screen">
                        <div className="h-screen">
                            <img
                                className="object-cover w-full h-full"
                                src="https://images.unsplash.com/photo-1738258644135-29aa538dfa6f"
                            />
                        </div>
                        <div className="h-screen">
                            <img
                                className="object-cover w-full h-full"
                                src="https://images.unsplash.com/photo-1738676469786-6fe6c1acabf2"
                            />
                        </div>
                    </Carousel>
                </div>
            </div>
        </ConfigProvider>
    );
}
