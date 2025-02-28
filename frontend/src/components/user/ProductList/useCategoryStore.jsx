import { create } from "zustand";

const useCategoryStore = create((set) => ({
    categoryMenu: null,
    setCategoryMenu: (category) => set({ categoryMenu: category }),
}));

export default useCategoryStore;
