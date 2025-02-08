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
            <div className="h-screen w-screen grid grid-cols-5 bg-white">
                <div className="md:col-span-3 col-span-5 flex flex-col sm:items-center   items-left justify-center">
                    <p className="text-4xl font-bold font-[Koulen] sm:mb-6 sm:pl-0 mb-0 ml-5 tracking-wider text-[#4169E2]">
                        PICK&PAY
                    </p>
                    <Outlet />
                </div>
                <div className="md:col-span-2 hidden md:block h-full">
                    <Carousel autoplay className="h-screen">
                        <div className="h-screen">
                            <img
                                className="object-cover w-full h-full"
                                src="https://images.unsplash.com/photo-1574079771556-f09a65db11e0"
                            />
                        </div>
                        <div className="h-screen">
                            <img
                                className="object-cover w-full h-full"
                                src="https://images.unsplash.com/photo-1577538928305-3807c3993047"
                            />
                        </div>
                    </Carousel>
                </div>
            </div>
        </ConfigProvider>
    );
}
