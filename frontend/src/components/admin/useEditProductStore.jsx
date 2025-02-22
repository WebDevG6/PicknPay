import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { create } from 'zustand';

const useEditProductStore = create((set) => ({
    loading: false,
    originalPictures: [],
    pictureList: [],
    selectedPicture: null,
    brand: "",

    setLoading: (loading) => set({ loading }),
    setOriginalPictures: (originalPictures) => set({ originalPictures }),
    setPictureList: (pictureList) => set({ pictureList }),
    setSelectedPicture: (selectedPicture) => set({ selectedPicture }),
    setBrand: (brand) => set({ brand }),

    handleLocalPreview: (file) => {
        const previewUrl = URL.createObjectURL(file);
        set((state) => ({
            pictureList: [
                ...state.pictureList,
                {
                    file,
                    previewUrl,
                },
            ],
            selectedPicture: previewUrl,
        }));
    },

    confirmDeletePicture: (picture) => {
        Modal.confirm({
            title: 'คุณแน่ใจหรือไม่?',
            icon: <ExclamationCircleOutlined />,
            content: 'การลบรูปนี้จะไม่สามารถกู้คืนได้',
            okText: 'ใช่, ลบเลย',
            cancelText: 'ยกเลิก',
            onOk: () => {
                set((state) => {
                    const updated = state.pictureList.filter((pic) => pic !== picture);
                    const newSelectedPicture = updated.length > 0 ? updated[0].url ?? updated[0].previewUrl : null;

                    return {
                        pictureList: updated,
                        selectedPicture: newSelectedPicture,
                    };
                });
            },
        });
    },

    resetState: () => {
        set({
            loading: false,
            originalPictures: [],
            pictureList: [],
            selectedPicture: null,
        });
    },
}));

export default useEditProductStore;