import ProductTable from "../../components/admin/ProductTable";
import EditProductModal from "../../components/admin/EditProductModal";
import useEditProductStore from "../../components/admin/useEditProductStore";
import useProducts from "../../hooks/useProducts";

const ManageProducts = () => {
    const { editingProduct, setEditingProduct } = useEditProductStore();
    const { fetchProducts } = useProducts()

    return (
        <div className="p-2 mx-1 my-1">
            <ProductTable onEdit={setEditingProduct} />
            <EditProductModal visible={!!editingProduct} />
        </div>
    );
};

export default ManageProducts;
