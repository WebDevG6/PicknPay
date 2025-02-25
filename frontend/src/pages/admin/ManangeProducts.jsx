import ProductTable from "../../components/admin/ProductTable";
import EditProductModal from "../../components/admin/EditProductModal";
import useEditProductStore from "../../components/admin/useEditProductStore";

const ManageProducts = () => {
    const { editingProduct, setEditingProduct } = useEditProductStore();

    return (
        <div className="p-2">
            <ProductTable onEdit={setEditingProduct} />
            <EditProductModal visible={!!editingProduct} />
        </div>
    );
};

export default ManageProducts;
