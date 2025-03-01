import { create } from "zustand";

const useBrandStore = create((set) => ({
    selectedBrand: [],
    toggleBrand: (brand) =>
        set((state) => ({
            selectedBrand: state.selectedBrand.includes(brand)
                ? state.selectedBrand.filter((b) => b !== brand)
                : [...state.selectedBrand, brand],
        })),
}));

export default useBrandStore;
