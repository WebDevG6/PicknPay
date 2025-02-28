import React, { useState, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import { Button, Drawer, Flex, ConfigProvider, Divider, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { SlidersHorizontal } from "lucide-react";
import { useLocation } from "react-router-dom";
import PriceRangeSelector from "./PriceRangeSelector";
import useBrandStore from "./useBrandStore";
import useFilterStore from "./useFilterStore";
import useCategoryStore from "./useCategoryStore";

const VALID_CATEGORIES = ["headphone", "mouse", "keyboard", "microphone", "computer", "loudspeaker"];

const FilterDropdown = ({ label, overlay, onOpenChange }) => (
    <Dropdown overlay={overlay} trigger={["click"]} onOpenChange={onOpenChange}>
        <Button type="primary" className="w-auto px-4 py-2 flex items-center gap-2 min-w-fit relative">
            <span className="font-[Kanit] whitespace-nowrap">{label}</span>
            <DownOutlined />
        </Button>
    </Dropdown>
);

const FilterSection = ({ title, children }) => (
    <section className="flex flex-col items-center w-full px-1">
        <p className="font-[Kanit] flex justify-center mt-4 text-xl">{title}</p>
        {children}
    </section>
);

const ProductListFilter = ({ products }) => {
    const { selectedBrand, toggleBrand } = useBrandStore();
    const { categoryMenu, setCategoryMenu } = useCategoryStore();
    const resetFilters = useFilterStore((state) => state.resetFilters);
    const [open, setOpen] = useState(false);
    const [initialScrollTo, setInitialScrollTo] = useState(null);
    const sliderKeyRef = useRef(0);
    const [sliderRenderKey, setSliderRenderKey] = useState(0);
    const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
    const location = useLocation();
    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const hasCategoryParam = useMemo(() => params.has("category"), [params]);
    const isProductsPage = useMemo(() => location.pathname === "/products" && !hasCategoryParam, [location.pathname, hasCategoryParam]);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    const availableCategories = useMemo(() => {
        if (!products) return VALID_CATEGORIES;
        return [...new Set(products.map((p) => p.category.name.trim().toLowerCase()))];
    }, [products]);

    const brandList = useMemo(() => {
        return [...new Set(products.map(({ brands }) => brands?.brandname?.trim()).filter(Boolean))];
    }, [products]);

    const forceUpdateSlider = () => {
        sliderKeyRef.current += 1;
        setSliderRenderKey(sliderKeyRef.current);
    };

    const handleCategorySelect = (selectedCategory) => {
        setCategoryMenu(selectedCategory);
        setCategoryDropdownOpen(false);
    };

    const showDrawer = useCallback(() => {
        setOpen(true);
    }, []);

    const onClose = () => {
        setOpen(false);
    };

    const handleDropdownVisibleChange = (visible) => {
        setPriceDropdownOpen(visible);
        if (visible) {
            requestAnimationFrame(forceUpdateSlider);
        }
    };

    const onDrawerOpen = useCallback(() => {
        if (initialScrollTo && sectionRefs[initialScrollTo]?.current) {
            sectionRefs[initialScrollTo].current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
        requestAnimationFrame(forceUpdateSlider);
    }, [initialScrollTo]);

    useLayoutEffect(() => {
        if (open) {
            forceUpdateSlider();
        }
    }, [open]);

    const categoryDropdown = (
        <Menu>
            {availableCategories.map((c) => (
                <Menu.Item key={c} onClick={() => handleCategorySelect(c)}>
                    {c}
                </Menu.Item>
            ))}
        </Menu>
    );

    const priceDropdown = (
        <Menu>
            <div className="px-4 py-2 max-h-40 overflow-y-auto" onMouseDown={(e) => e.stopPropagation()}>
                <PriceRangeSelector key={sliderRenderKey} />
            </div>
        </Menu>
    );

    const brandDropdown = (
        <Menu>
            <div className="px-4 py-2 max-h-40 overflow-y-auto">
                {brandList.map((brand) => (
                    <div key={brand} className="flex items-center gap-2 py-1 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedBrand.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 accent-blue-500"
                        />
                        <span>{brand}</span>
                    </div>
                ))}
            </div>
        </Menu>
    );

    return (
        <div className="w-full">
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
                        <div className="hidden md:flex flex-wrap gap-2 justify-start w-full relative">
                            <Button
                                type="primary"
                                onClick={showDrawer}
                                className="w-auto px-4 py-2 flex items-center gap-2 min-w-fit"
                            >
                                <SlidersHorizontal size={18} strokeWidth={2} className="text-gray-500" />
                                <span className="font-[Kanit] whitespace-nowrap">ตัวกรองทั้งหมด</span>
                            </Button>

                            {isProductsPage && (
                                <FilterDropdown label={`หมวดหมู่ ${categoryMenu ? `: ${categoryMenu}` : ""}`} overlay={categoryDropdown} onOpenChange={setCategoryDropdownOpen} />
                            )}

                            <FilterDropdown label="ช่วงราคา" overlay={priceDropdown} onOpenChange={handleDropdownVisibleChange} />
                            <FilterDropdown label="แบรนด์" overlay={brandDropdown} />

                            <Button
                                type="default"
                                danger
                                onClick={resetFilters}
                                style={{ fontFamily: "Kanit" }}
                                className="w-auto px-4 py-2 flex items-center gap-2 min-w-fit"
                            >
                                <span>ล้างตัวกรองทั้งหมด</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 md:hidden w-full relative">
                            <Button
                                type="primary"
                                onClick={showDrawer}
                                className="w-full px-4 py-2 flex items-center gap-2 min-w-fit"
                            >
                                <SlidersHorizontal size={18} strokeWidth={2} className="text-gray-500" />
                                <span className="font-[Kanit] whitespace-nowrap">ตัวกรองทั้งหมด</span>
                            </Button>

                            {isProductsPage && (
                                <FilterDropdown label={`หมวดหมู่ ${categoryMenu ? `: ${categoryMenu}` : ""}`} overlay={categoryDropdown} onOpenChange={setCategoryDropdownOpen} />
                            )}

                            <FilterDropdown label="ช่วงราคา" overlay={priceDropdown} onOpenChange={handleDropdownVisibleChange} />
                            <FilterDropdown label="แบรนด์" overlay={brandDropdown} />

                            <Button
                                type="default"
                                danger
                                onClick={resetFilters}
                                style={{ fontFamily: "Kanit" }}
                                className="w-full px-4 py-2 flex items-center gap-2 min-w-fit"
                            >
                                <span>ล้างตัวกรองทั้งหมด</span>
                            </Button>
                        </div>
                    </Flex>
                </ConfigProvider>
            </div>

            <Drawer
                title={<p className="font-[Kanit] text-xl">ตัวกรองทั้งหมด</p>}
                open={open}
                onClose={onClose}
                width={350}
                afterOpenChange={onDrawerOpen}
                styles={{ body: { padding: "3px" } }}
                footer={
                    <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 w-full px-0.5">
                        <Button
                            type="primary"
                            danger
                            onClick={() => {
                                resetFilters();
                                onClose();
                            }}
                            style={{ fontFamily: "Kanit" }}
                            className="w-full sm:w-auto sm:min-w-[150px] px-4"
                        >
                            ล้างตัวกรองทั้งหมด
                        </Button>
                        <Button
                            type="primary"
                            onClick={onClose}
                            style={{ fontFamily: "Kanit" }}
                            className="w-full sm:w-auto sm:min-w-[150px] px-4"
                        >
                            เสร็จสิ้น
                        </Button>
                    </div>
                }
            >
                {isProductsPage && (
                    <>
                        <FilterSection title="หมวดหมู่">
                            <div className="max-h-40 overflow-y-auto w-full px-4">
                                {VALID_CATEGORIES.map((category) => (
                                    <label key={category} className="flex justify-between py-2 cursor-pointer w-full">
                                        <div className="flex gap-2">
                                            <input
                                                type="radio"
                                                checked={categoryMenu === category}
                                                onChange={() => setCategoryMenu(category)}
                                                className="w-5 h-5 accent-blue-500 cursor-pointer"
                                            />
                                            <span>{category}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </FilterSection>
                        <Divider />
                    </>
                )}

                <FilterSection title="ช่วงราคา">
                    <PriceRangeSelector key={sliderRenderKey} />
                </FilterSection>
                <Divider />
                <FilterSection title="แบรนด์">
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
                </FilterSection>
            </Drawer>
        </div>
    );
};

export default ProductListFilter;