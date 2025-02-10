import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router";
import { Button, ConfigProvider, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { authContext } from "../context/AuthContext";

const imageProfileMockUrl =
    "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg";

const userNavigation = [
    { name: "Profile", to: "/profile" },
    { name: "Logout", to: "/logout" },
];

export default function userLayout() {
    const { userInfo } = useContext(authContext);
    const navigate = useNavigate();

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "Poppins",
                    colorPrimary: "#4169E2",
                },
            }}
        >
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-white  drop-shadow-lg">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-14 items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="shrink-0">
                                    <p className="text-3xl font-bold font-[Koulen] tracking-wider text-[#4169E2]">
                                        PICK&PAY
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <Button style={{ padding: 8, borderRadius: 5 }} type="primary">
                                        <i className="fi fi-rr-apps text-xl translate-y-[2.8px]"></i>
                                        <span className="font-[Kanit]">สินค้าทั้งหมด</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="lg:w-[30em] w-[20em]">
                                <Input
                                    allowClear
                                    style={{ borderRadius: 100, background: "#F5F5F5" }}
                                    prefix={<SearchOutlined style={{ fontSize: 16, color: "#9AA1AE" }} />}
                                />
                            </div>
                            {userInfo ? (
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        <div className="flex items-center gap-2">
                                            <button className="inline-flex justify-center items-center text-center cursor-pointer text-gray-400 hover:text-[#4169E2] transition">
                                                <i className="fi fi-rr-shopping-cart text-2xl translate-y-[3.5px]" />
                                            </button>

                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <MenuButton className="relative flex max-w-xs items-center rounded-full cursor-pointer text-sm hover:ring-2 transition ring-[#4169E2]">
                                                        <img
                                                            alt="profile"
                                                            src={imageProfileMockUrl}
                                                            className="size-8 rounded-full"
                                                        />
                                                    </MenuButton>
                                                </div>
                                                <MenuItems
                                                    transition
                                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                                >
                                                    {userNavigation.map((item) => (
                                                        <MenuItem key={item.name}>
                                                            <a
                                                                onClick={() => navigate(item.to)}
                                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden cursor-pointer"
                                                            >
                                                                {item.name}
                                                            </a>
                                                        </MenuItem>
                                                    ))}
                                                </MenuItems>
                                            </Menu>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={() => navigate("/login")}
                                    style={{ borderRadius: 5, letterSpacing: 1 }}
                                >
                                    Login
                                </Button>
                            )}
                        </div>
                    </div>
                </Disclosure>

                <main className="bg-[#F5F5F5]">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
                <footer className="items-center justify-center flex bg-white p-3.5 text-sm">
                    <p>© 2025 picknpay.com All Rights.</p>
                </footer>
            </div>
        </ConfigProvider>
    );
}
