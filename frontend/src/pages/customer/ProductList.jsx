import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { List, Button, Layout, Empty, ConfigProvider } from "antd";
import { motion } from "framer-motion";
import useProducts from "@hooks/useProducts";
import usePriceStore from "@components/customer/ProductList/usePriceStore";
import useBrandStore from "@components/customer/ProductList/useBrandStore";
import useCategoryStore from "@components/customer/ProductList/useCategoryStore";
import ProductListCard from "@components/customer/ProductList/ProductListCard";
import ProductListFilter from "@components/customer/ProductList/ProductListFilter";

const { Content } = Layout;
const PAGE_SIZE = 12;
const VALID_CATEGORIES = ["headphone", "mouse", "keyboard", "microphone", "computer", "loudspeaker"];

const ProductList = () => {
    const { products, productsLoading } = useProducts();
    const { categoryMenu } = useCategoryStore();

    const { price } = usePriceStore();
    const { selectedBrand } = useBrandStore();
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const location = useLocation();
    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const category = useMemo(() => params.get("category")?.trim().toLowerCase() || "", [params]);
    const hasInvalidQuery = useMemo(() => {
        return (
            location.search === "?" ||
            (params.has("category") && !category) ||
            [...params.keys()].some((key) => key !== "category")
        );
    }, [location.search, params, category]);
    const isProductsPage = useMemo(
        () => location.pathname === "/products" && !hasInvalidQuery,
        [location.pathname, hasInvalidQuery]
    );

    useEffect(() => {
        if (productsLoading) return;

        let newFilteredProducts = [];

        if (isProductsPage && !category) {
            newFilteredProducts = products || [];
        } else if (VALID_CATEGORIES.includes(category)) {
            newFilteredProducts = products.filter((product) => product.category.name.trim().toLowerCase() === category);
        }
        newFilteredProducts = newFilteredProducts.filter(
            (product) => product.price >= price[0] && product.price <= price[1]
        );

        if (categoryMenu && VALID_CATEGORIES.includes(categoryMenu)) {
            newFilteredProducts = newFilteredProducts.filter(
                (product) => product.category.name.trim().toLowerCase() === categoryMenu
            );
        }

        if (selectedBrand.length) {
            newFilteredProducts = newFilteredProducts.filter(
                (product) => product.brands && selectedBrand.includes(product.brands.brandname)
            );
        }

        setFilteredProducts(newFilteredProducts);
    }, [products, category, price, productsLoading, params, selectedBrand, categoryMenu]);

    const loadMoreProducts = () => setVisibleCount((prev) => prev + PAGE_SIZE);

    return (
        <div className="w-full min-h-[40vh]">
            <Layout className="min-h-screen bg-gray-300">
                <ProductListFilter products={products} />
                <Content className="flex justify-center items-center w-full py-6">
                    {productsLoading ? (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80">
                            <p className="text-2xl font-semibold">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="top-0 left-0 w-full h-full flex-col mt-12 z-20">
                            <Empty
                                description="ไม่มีสินค้าที่ตรงกับหมวดหมู่นี้"
                                className="items-center justify-center"
                            />
                        </div>
                    ) : (
                        <List
                            className="w-full rounded-lg"
                            grid={{ gutter: 24, xs: 2, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                            dataSource={filteredProducts.slice(0, visibleCount)}
                            renderItem={(product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0.3, scale: 0.95 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="flex justify-center w-full"
                                >
                                    <List.Item className="flex justify-center">
                                        <ProductListCard product={product} />
                                    </List.Item>
                                </motion.div>
                            )}
                        />
                    )}
                </Content>
                {visibleCount < (filteredProducts?.length || 0) && !productsLoading && (
                    <div className="flex justify-center mt-4">
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: "#ffffff",
                                    colorPrimaryHover: "#e0e0e0",
                                    colorPrimaryActive: "#33333",
                                },
                                components: {
                                    Button: {
                                        colorTextLightSolid: "#212432",
                                    },
                                },
                            }}
                        >
                            <Button
                                type="primary"
                                className="px-6 py-2 text-lg font-[Kanit]"
                                onClick={loadMoreProducts}
                            >
                                คลิกเพื่อโหลดดูต่อ
                            </Button>
                        </ConfigProvider>
                    </div>
                )}
            </Layout>
        </div>
    );
};

export default ProductList;
