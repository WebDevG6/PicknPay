import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { create } from "zustand";
import ax from "@conf/ax";

const useEditProductStore = create((set) => ({
    loading: false,
    originalPictures: [],
    pictureList: [],
    selectedPicture: null,
    brand: "",
    brands: [],
    editingProduct: null,

    setLoading: (loading) => set((state) => ({ ...state, loading })),
    setOriginalPictures: (originalPictures) => set((state) => ({ ...state, originalPictures })),
    setPictureList: (pictureList) => set((state) => ({ ...state, pictureList })),
    setSelectedPicture: (selectedPicture) => set((state) => ({ ...state, selectedPicture })),
    setBrand: (brand) => set((state) => ({ ...state, brand })),
    setEditingProduct: (product) => set((state) => ({ ...state, editingProduct: product })),

    handleLocalPreview: (file) => {
        const previewUrl = URL.createObjectURL(file);
        set((state) => ({
            ...state,
            pictureList: [...state.pictureList, { file, previewUrl }],
            selectedPicture: previewUrl,
        }));

        setTimeout(() => URL.revokeObjectURL(previewUrl), 5000);
    },

    confirmDeletePicture: (picture) => {
        Modal.confirm({
            title: "คุณแน่ใจหรือไม่?",
            icon: <ExclamationCircleOutlined />,
            content: "การลบรูปนี้จะไม่สามารถกู้คืนได้",
            okText: "ใช่, ลบเลย",
            cancelText: "ยกเลิก",
            onOk: () => {
                set((state) => {
                    const updated = state.pictureList.filter((pic) => pic !== picture);
                    const newSelectedPicture = updated.length > 0 ? updated[0].url ?? updated[0].previewUrl : null;
                    return { pictureList: updated, selectedPicture: newSelectedPicture };
                });
            },
            onCancel: () => {},
        });
    },

    fetchBrands: async () => {
        try {
            const response = await ax.get("/brands");
            const brandsData = response.data.data.map((brand) => ({
                id: brand.id,
                name: brand.brandname,
            }));
            set({ brands: brandsData });
        } catch (error) {
            console.error("Error fetching brands:", error.response?.data || error.message);
        }
    },

    resetState: () => {
        set({
            loading: false,
            originalPictures: [],
            pictureList: [],
            selectedPicture: null,
            brand: "",
            brands: [],
            editingProduct: null,
        });
    },
}));

export default useEditProductStore;
