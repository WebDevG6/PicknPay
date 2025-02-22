
import { useState } from "react";
import ProductTable from "../../components/admin/ProductTable";
import EditProductModal from "../../components/admin/EditProductModal";

const ManageProducts = () => {
    const [editingProduct, setEditingProduct] = useState(null);

    return (
        <div className="p-2 mx-1 my-1">
            <ProductTable onEdit={setEditingProduct} />
            <EditProductModal
                visible={!!editingProduct}
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
            />
        </div>
    );
};

export default ManageProducts;
