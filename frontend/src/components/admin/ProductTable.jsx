import { useState, useMemo } from "react";
import { Table, Button, Modal, Image, Spin, Input, Select, Slider } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import useProducts from "../../hooks/useProducts";
import conf from "../../conf/main";
import { motion } from "framer-motion";

const { Option } = Select;

const ProductTable = ({ onEdit }) => {
    const { products, productsLoading, deleteProduct, refetchProducts } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 100000]);

    const showDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedProduct) {
            deleteProduct(selectedProduct.documentId);
            refetchProducts();
        }
        setIsModalOpen(false);
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
            const matchesCategory = selectedCategory ? product.category?.id === selectedCategory : true;
            const matchesBrand = selectedBrand ? product.brands?.id === selectedBrand : true;
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
        });
    }, [products, searchText, selectedCategory, selectedBrand, priceRange]);

    const resetFilters = () => {
        setSearchText("");
        setSelectedCategory(null);
        setSelectedBrand(null);
        setPriceRange([0, 100000]);
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.3 },
        }),
    };

    const memoizedColumns = useMemo(
        () => [
            {
                title: "Thumbnail",
                dataIndex: "picture",
                className: "items-center",
                width: 100,
                render: (pictures) =>
                    pictures?.length ? (
                        <div className="flex justify-center items-center">
                            <Image
                                width={50}
                                src={`${conf.urlPrefix}${pictures[0].url}`}
                                placeholder={<Spin />}
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div className="text-center">No Image</div>
                    ),
            },
            {
                title: "Name",
                dataIndex: "name",
                width: 300,
            },
            {
                title: "Price",
                dataIndex: "price",
                width: 100,
                render: (price) => `฿${price.toLocaleString()}`,
            },
            {
                title: "Category",
                dataIndex: "category",
                render: (category) => category?.name || "-",
                width: 130,
            },
            {
                title: "Brand",
                dataIndex: "brands",
                render: (brand) => brand?.brandname || "-",
                width: 130,
            },
            {
                title: "Stock",
                dataIndex: "stock",
                width: 100,
            },
            {
                title: "Actions",
                width: 100,
                render: (_, record) => (
                    <div className="flex gap-2">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            className="border-gray-300 text-gray-600 rounded-md p-2 
                        hover:border-gray-400 hover:bg-gray-100 transition-all duration-300"
                        />
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteModal(record)}
                            className="border-red-300 text-red-600 rounded-md p-2 
                        hover:border-red-400 hover:bg-red-100 transition-all duration-100"
                        />
                    </div>
                ),
            },
        ],
        [onEdit]
    );

    return (
        <div className="min-h-[500px] flex flex-col items-center justify-center rounded-lg  w-full bg-white mt-2 p-[18px]">
            {productsLoading ? (
                <div className="flex flex-col items-center justify-center h-screen">
                    <Spin size="large" />
                    <p className="mt-2 text-gray-500">กำลังโหลดสินค้า...</p>
                </div>
            ) : (
                <div className="w-full">
                    <div className="grid grid-cols-1 gap-4 mb-4 w-full">
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="ค้นหาสินค้า"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full h-8 rounded-lg px-3"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 w-full">
                            <div className="col-span-3 min-w-0 h-8 flex items-center bg-white border border-gray-300 rounded-lg px-3">
                                <span className="text-gray-500 text-sm whitespace-nowrap px-3">
                                    ฿{priceRange[0].toLocaleString()} - ฿{priceRange[1].toLocaleString()}
                                </span>
                                <Slider
                                    range
                                    min={0}
                                    max={100000}
                                    step={100}
                                    value={priceRange}
                                    onChange={setPriceRange}
                                    tooltip={{ formatter: (value) => `฿${value.toLocaleString()}` }}
                                    className="flex-1 px-4"
                                />
                            </div>
                            <Select
                                placeholder="เลือกหมวดหมู่"
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                allowClear
                                className="col-span-1 w-full h-10 rounded-lg"
                            >
                                {products
                                    .map((product) => product.category)
                                    .filter((v, i, a) => v && a.findIndex((t) => t.id === v.id) === i)
                                    .map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                            </Select>

                            <Select
                                placeholder="เลือกแบรนด์"
                                value={selectedBrand}
                                onChange={setSelectedBrand}
                                allowClear
                                className="col-span-1 w-full h-10 rounded-lg"
                            >
                                {products
                                    .map((product) => product.brands)
                                    .filter((v, i, a) => v && a.findIndex((t) => t.id === v.id) === i)
                                    .map((brand) => (
                                        <Option key={brand.id} value={brand.id}>
                                            {brand.brandname}
                                        </Option>
                                    ))}
                            </Select>

                            <Button
                                danger
                                onClick={resetFilters}
                                className="col-span-1 w-full h-10 rounded-lg text-gray-600 bg-white hover:bg-gray-100 justify-self-end"
                            >
                                ล้างตัวกรอง
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col min-h-[500px] rounded-2xl">
                        <Table
                            columns={memoizedColumns}
                            dataSource={filteredProducts}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            size="small"
                            bordered={true}
                            scroll={{ x: true }}
                            className="w-full flex-grow"
                            components={{
                                body: {
                                    wrapper: motion.tbody,
                                    row: motion.tr,
                                },
                            }}
                            rowClassName={(record, index) => "table-row"}
                            onRow={(record, index) => ({
                                initial: "hidden",
                                animate: "visible",
                                custom: index,
                                variants: rowVariants,
                            })}
                        />
                    </div>
                </div>
            )}

            <Modal
                title="ยืนยันการลบสินค้า"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                        ยกเลิก
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDelete}>
                        ยืนยันลบ
                    </Button>,
                ]}
            >
                <p>คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้? </p>
                {selectedProduct && <p className="text-red-600 font-bold">{selectedProduct.name}</p>}
            </Modal>
        </div>
    );
};

export default ProductTable;
