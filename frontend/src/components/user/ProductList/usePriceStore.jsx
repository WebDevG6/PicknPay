
import { create } from "zustand";

const usePriceStore = create((set) => ({
    price: [0, 100000],
    setPrice: (newPrice) => set({ price: newPrice }),
}));

export default usePriceStore;
