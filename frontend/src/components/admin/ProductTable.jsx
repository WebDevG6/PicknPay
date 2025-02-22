import { useState } from "react";
import { Table, Button, Modal, Image, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useProducts from "../../hooks/useProducts";
import conf from "../../conf/main";

const ProductTable = ({ onEdit }) => {
    const { products, productsLoading, deleteProduct } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const showDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };
    const handleDelete = () => {
        if (selectedProduct) {
            deleteProduct(selectedProduct.documentId);
        }
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: "Thumbnail",
            dataIndex: "picture",
            render: (pictures) =>
                pictures?.length ? <Image width={50} src={`${conf.urlPrefix}${pictures[0].url}`} /> : "No Image",
        },
        {
            title: "Name",
            dataIndex: "name",
            className: "hidden sm:table-cell",
        },
        {
            title: "Price",
            dataIndex: "price",
            className: "hidden sm:table-cell",
        },
        {
            title: "Category",
            dataIndex: "category",
            render: (category) => category?.name || "-",
            className: "hidden md:table-cell",
        },
        {
            title: "Brand",
            dataIndex: "brands",
            render: (brand) => brand?.brandname || "-",
            className: "hidden lg:table-cell",
        },
        {
            title: "Stock",
            dataIndex: "stock",
            className: "hidden lg:table-cell",
        },
        {
            title: "Actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        className="border-gray-300 text-gray-600 rounded-md p-2 hover:border-gray-400 hover:bg-gray-100"
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteModal(record)}
                        className="border-red-300 text-red-600 rounded-md p-2 hover:border-red-400 hover:bg-red-100"
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-[400px] flex items-center justify-center shadow-xl rounded-xl">
            {productsLoading ? (
                <div className="flex flex-col items-center justify-center h-screen">
                    <Spin size="large" />
                    <p className="mt-2 text-gray-500">Loading Products...</p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={products}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        className="w-full"
                    />
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
