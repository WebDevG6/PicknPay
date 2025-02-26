import React, { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Button, ConfigProvider, Drawer, AutoComplete } from "antd";
import { SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CartQuantity from "../components/CartQuantity";
import { authContext } from "../context/AuthContext";
import useProducts from "../hooks/useProducts";

const imageProfileMockUrl =
    "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg";

const userNavigation = [
    { name: "โปรไฟล์", to: "/customer/profile" },
    { name: "รายการสินค้าของฉัน", to: "/customer/order" },
    { name: "ออกจากระบบ", to: "/logout" },
];

const userNavigationMenu = [
    { name: "โปรไฟล์", to: "/customer/profile" },
    { name: "รถเข็น", to: "/customer/cart" },
    { name: "รายการสินค้าของฉัน", to: "/customer/order" },
    { name: "ออกจากระบบ", to: "/logout" },
];

export default function userLayout() {
    const { products } = useProducts();
    const { userInfo } = useContext(authContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const onSelect = (value, option) => {
        navigate(`/products/${option.productId}`);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "Poppins",
                    colorPrimary: "#4169E2",
                },
            }}
        >
            <div className="min-h-full z-50">
                <Disclosure as="nav" className="bg-white  drop-shadow-lg">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-14 items-center justify-between">
                            <div className="block md:hidden">
                                <button
                                    className="inline-flex justify-center items-center text-center cursor-pointer p-1 h-7 w-7 text-gray-400 hover:bg-[#F0F0F0] hover:text-black transition rounded-sm"
                                    onClick={showDrawer}
                                >
                                    <MenuOutlined className="text-xl" />
                                </button>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="shrink-0">
                                    <p className="text-3xl font-bold font-[Koulen] tracking-wider text-[#4169E2]">
                                        PICK&PAY
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <Button
                                        style={{ padding: 8, borderRadius: 5 }}
                                        type="primary"
                                        onClick={() => navigate("/")}
                                    >
                                        <i className="fi fi-rr-apps text-xl translate-y-[2.8px]"></i>
                                        <span className="font-[Kanit]">สินค้าทั้งหมด</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="lg:w-[30em] w-[20em] hidden md:block">
                                <AutoComplete
                                    options={products.map((item) => {
                                        return { value: item.name, productId: item.id };
                                    })}
                                    onSelect={onSelect}
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                    placeholder={<p className="ml-1">ค้นหารายการสินค้า</p>}
                                    allowClear
                                    prefix={<SearchOutlined style={{ fontSize: 16, color: "#9AA1AE" }} />}
                                    style={{
                                        borderRadius: 10,
                                        background: "#F5F5F5",
                                        width: "100%",
                                        fontFamily: "Kanit",
                                    }}
                                />
                            </div>
                            <div className="md:hidden block">
                                <button className="inline-flex justify-center items-center text-center cursor-pointer p-1 h-7 w-7 text-gray-400 hover:bg-[#F0F0F0] hover:text-black transition rounded-sm">
                                    <SearchOutlined style={{ fontSize: 20 }} />
                                </button>
                            </div>
                            {userInfo ? (
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate("/customer/cart")}
                                                className="relative inline-flex justify-center items-center text-center cursor-pointer text-gray-400 hover:text-[#4169E2] transition"
                                            >
                                                <div className="absolute -top-1 -right-2.5 bg-red-500 text-white text-[10px] font-light px-1.5 py-0.5 min-w-[18px] rounded-full z-50">
                                                    <CartQuantity />
                                                </div>

                                                <i className="fi fi-rr-shopping-cart text-2xl translate-y-[3.5px]" />
                                            </button>

                                            <Menu as="div" className="relative ml-3">
                                                <MenuButton className="relative flex max-w-xs items-center rounded-full cursor-pointer text-sm hover:ring-2 transition ring-[#4169E2]">
                                                    <img
                                                        alt="profile"
                                                        src={imageProfileMockUrl}
                                                        className="size-8 rounded-full"
                                                    />
                                                </MenuButton>

                                                <MenuItems
                                                    transition
                                                    className="absolute z-50 right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                                >
                                                    {userNavigation.map((item) => (
                                                        <MenuItem key={item.name}>
                                                            <a
                                                                onClick={() => navigate(item.to)}
                                                                className="block px-4 py-2 text-base text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden cursor-pointer font-[Kanit]"
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
                                <div className="hidden md:block ">
                                    <Button
                                        type="primary"
                                        onClick={() => navigate("/login")}
                                        style={{ borderRadius: 5, fontFamily: "Kanit" }}
                                    >
                                        เข้าสู่ระบบ
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Disclosure>
                <Drawer
                    title={
                        userInfo && (
                            <div className="flex flex-row justify-start items-center gap-3 ml-1">
                                <img alt="profile" src={imageProfileMockUrl} className="size-10 rounded-full" />
                                <div className="">
                                    <p>
                                        {userInfo.firstname} {userInfo.lastname}
                                    </p>
                                    <p className="text-sm text-gray-500">{userInfo.email}</p>
                                </div>
                            </div>
                        )
                    }
                    placement="left"
                    onClose={onClose}
                    open={open}
                >
                    {userInfo ? (
                        <div className="flex flex-col gap-2">
                            {userNavigationMenu.map((item) => (
                                <button
                                    key={item.name}
                                    className=" p-2 rounded-sm transition py-2 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer font-[Kanit] text-lg"
                                    onClick={() => navigate(item.to)}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <Button
                            type="primary"
                            onClick={() => navigate("/login")}
                            style={{ borderRadius: 5, width: "100%", fontFamily: "Kanit" }}
                        >
                            เข้าสู่ระบบ
                        </Button>
                    )}
                </Drawer>

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
