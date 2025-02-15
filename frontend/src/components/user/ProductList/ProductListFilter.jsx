import React, { useState, useRef, useCallback, useMemo } from "react";
import { Button, Drawer, Flex, ConfigProvider, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
import PriceRangeSelector from "./PriceRangeSelector";
import useBrandStore from "./useBrandStore";
import useFilterStore from "./useFilterStore";

const ProductListFilter = ({ products }) => {
    const { selectedBrand, toggleBrand } = useBrandStore();
    const resetFilters = useFilterStore((state) => state.resetFilters);
    const brandList = useMemo(() => {
        const uniqueBrands = [...new Set(products.map(({ brands }) => brands?.brandname?.trim()).filter(Boolean))];
        return uniqueBrands;
    }, [products]);

    const filters = useMemo(
        () => [
            { label: "ช่วงราคา", hasIcon: true },
            { label: "แบรนด์", hasIcon: true },
            { label: "ประเภทสินค้า", hasIcon: true },
        ],
        []
    );

    const [open, setOpen] = useState(false);
    const [initialScrollTo, setInitialScrollTo] = useState(null);

    const sectionRefs = {
        ช่วงราคา: useRef(null),
        แบรนด์: useRef(null),
        ประเภทสินค้า: useRef(null),
    };

    const showDrawer = useCallback((filterLabel) => {
        setInitialScrollTo(filterLabel);
        setOpen(true);
    }, []);

    const onClose = () => {
        setOpen(false);
    };

    const onDrawerOpen = useCallback(() => {
        if (initialScrollTo && sectionRefs[initialScrollTo]?.current) {
            sectionRefs[initialScrollTo].current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [initialScrollTo]);

    return (
        <div className="w-full relative">
            <div className="rounded-lg bg-[#6d8ce8] p-3 w-full mx-auto">
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#ffffff",
                            colorPrimaryHover: "#e0e0e0",
                            colorPrimaryActive: "#707070",
                        },
                        components: { Button: { colorTextLightSolid: "#212432" } },
                    }}
                >
                    <Flex vertical gap="small" className="w-full min-w-0 overflow-hidden">
                        <Flex
                            gap="small"
                            wrap="wrap"
                            className="w-full justify-center sm:justify-start grid grid-cols-2 sm:flex"
                        >
                            <Button
                                type="primary"
                                onClick={() => showDrawer(null)}
                                className="w-full sm:w-fit px-6 py-2 md:w-auto gap-1"
                            >
                                <span className="font-[Kanit]">ตัวกรองทั้งหมด</span>
                            </Button>

                            {filters.map(({ label, hasIcon }, index) => (
                                <Button
                                    key={index}
                                    type="primary"
                                    onClick={() => showDrawer(label)}
                                    className="w-fit px-6 py-2 md:w-auto gap-1"
                                >
                                    <span className="font-[Kanit]">{label}</span>
                                    {hasIcon && <DownOutlined className="ml-1" />}
                                </Button>
                            ))}
                        </Flex>
                    </Flex>
                </ConfigProvider>
            </div>

            <Drawer
                title={<p className="font-[Kanit] text-xl">ตัวกรองทั้งหมด</p>}
                open={open}
                onClose={() => setOpen(false)}
                width={350}
                afterOpenChange={onDrawerOpen}
                styles={{ body: { padding: "3px" } }}
                footer={
                    <div className="p-4 flex justify-between gap-2">
                        <Button
                            type="primary"
                            danger
                            onClick={() => {
                                resetFilters();
                                onClose();
                            }}
                            style={{ fontFamily: "Kanit" }}
                            className="w-1/2 px-1"
                        >
                            ล้างตัวกรองทั้งหมด
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                onClose();
                            }}
                            style={{ fontFamily: "Kanit" }}
                            className="w-1/2 px-1"
                        >
                            เสร็จสิ้น
                        </Button>
                    </div>
                }
            >
                <section className="flex flex-col items-center w-full px-1">
                    <p ref={sectionRefs["ช่วงราคา"]} className="font-[Kanit] flex justify-center mt-4 text-xl">
                        ช่วงราคา
                    </p>
                    <PriceRangeSelector />
                </section>
                <Divider />
                <section className="flex flex-col items-center w-full ">
                    <p ref={sectionRefs["แบรนด์"]} className="font-[Kanit] flex justify-center mt-4 text-xl">
                        แบรนด์
                    </p>
                    <div className="max-h-40 overflow-y-auto w-full px-4">
                        {brandList.map((brand) => (
                            <label key={brand} className="flex justify-between py-2 cursor-pointer w-full">
                                <div className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedBrand.includes(brand)}
                                        onChange={() => toggleBrand(brand)}
                                        className="w-5 h-5 accent-blue-500 font-[Kanit] cursor-pointer"
                                    />
                                    <span>{brand}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>
                <Divider />
                {/* <section className="flex flex-col items-center w-full">
                    <Title
                        level={5}
                        ref={sectionRefs["ประเภทสินค้า"]}
                        className="font-[Kanit] flex justify-center mt-4"
                    >
                        ประเภทสินค้า
                    </Title>
                    <p>บลาาา</p>
                    <p>บลาาา</p>
                    <p>บลาาา</p>
                    <p>บลาาา</p>
                    <p>บลาาา</p>
                    <p>บลาาา</p>
                    <Divider />
                </section> */}
            </Drawer>
        </div>
    );
};

export default ProductListFilter;
