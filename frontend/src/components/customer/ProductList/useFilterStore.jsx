import { create } from "zustand";
import useBrandStore from "./useBrandStore";
import usePriceStore from "./usePriceStore";
import useCategoryStore from "./useCategoryStore";

const useFilterStore = create((set) => ({
    resetFilters: () => {
        useBrandStore.getState().selectedBrand.length && useBrandStore.setState({ selectedBrand: [] });
        usePriceStore.getState().setPrice([0, 100000]);
        useCategoryStore.getState().setCategoryMenu(null);
    },
}));

export default useFilterStore;
