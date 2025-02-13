import { create } from "zustand";
import useBrandStore from "./useBrandStore";
import usePriceStore from "./usePriceStore";

const useFilterStore = create((set) => ({
    resetFilters: () => {
        useBrandStore.getState().selectedBrand.length && useBrandStore.setState({ selectedBrand: [] });
        usePriceStore.getState().setPrice([0, 100000]);
    },
}));

export default useFilterStore;
