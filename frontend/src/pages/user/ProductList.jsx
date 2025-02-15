import React, { useState, useEffect, useMemo } from "react";
import { List, Button, Layout, Spin, Empty, ConfigProvider } from "antd";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import usePriceStore from "../../components/user/ProductList/usePriceStore";
import useBrandStore from "../../components/user/ProductList/useBrandStore";
import ProductListCard from "../../components/user/ProductList/ProductListCard";
import ProductListFilter from "../../components/user/ProductList/ProductListFilter";


const { Content } = Layout;
const PAGE_SIZE = 12;
const VALID_CATEGORIES = ["headphone", "mouse", "keyboard", "microphone", "computer", "loudspeaker"];

const ProductList = () => {
    const { products, productsLoading } = useProducts();
    const location = useLocation();
    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const category = useMemo(() => params.get("category")?.trim().toLowerCase() || "", [params]);
    const price = usePriceStore((state) => state.price);
    const { selectedBrand } = useBrandStore();
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [filteredProducts, setFilteredProducts] = useState([]);

    console.log(products)
    useEffect(() => {
        if (productsLoading) return;
        if (!params.has("category") || !category || !VALID_CATEGORIES.includes(category)) {
            setFilteredProducts(null);
            return;
        }

        const newFilteredProducts = (products || [])
            .filter((product) => product.category.name.trim().toLowerCase() === category)
            .filter((product) => product.price >= price[0] && product.price <= price[1])
            .filter((product) => !selectedBrand.length || selectedBrand.includes(product.brands.brandname));

        setFilteredProducts(newFilteredProducts);
    }, [products, category, price, productsLoading, params, selectedBrand]);

    const loadMoreProducts = () => setVisibleCount((prev) => prev + PAGE_SIZE);

    return (
        <div className="w-full relative min-h-[40vh] ">
            <Layout className="min-h-screen bg-gray-300">
                <ProductListFilter products={products} />
                <Content className="flex justify-center items-center w-full py-6">
                    {productsLoading ? (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80">
                            <Spin size="large" />
                        </div>
                    ) : filteredProducts === null || filteredProducts.length === 0 ? (
                        <div className="top-0 left-0 w-full h-full flex-col mt-12 ">
                            <Empty description="ไม่มีสินค้าที่ตรงกับหมวดหมู่นี้" className="items-center justify-center" />
                        </div>
                    ) : (
                        <List
                            className="w-full rounded-lg"
                            grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
                            dataSource={filteredProducts.slice(0, visibleCount)}
                            renderItem={(product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0.2, scale: 0.95 }}
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
                            <Button type="primary" className="px-6 py-2 text-lg font-[Kanit]" onClick={loadMoreProducts}>
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
