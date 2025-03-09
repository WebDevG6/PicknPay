import { render, screen, waitFor, waitForElementToBeRemoved, cleanup, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import ProductList from "./ProductList";
import useProducts from "@hooks/useProducts";
import usePriceStore from "@components/customer/ProductList/usePriceStore";
import useBrandStore from "@components/customer/ProductList/useBrandStore";
import useCategoryStore from "@components/customer/ProductList/useCategoryStore";

vi.mock("@hooks/useProducts", () => ({
    default: vi.fn(() => ({
        products: [],
        productsLoading: false,
    })),
}));

vi.mock("@components/customer/ProductList/usePriceStore", () => ({ default: vi.fn() }));
vi.mock("@components/customer/ProductList/useBrandStore", () => ({ default: vi.fn() }));
vi.mock("@components/customer/ProductList/useCategoryStore", () => ({ default: vi.fn() }));


describe("ProductList Filter Functionality", () => {
    beforeEach(async () => {
        useProducts.mockImplementation(() => ({
            products: [
                { id: 1, name: "Keyboard A", category: { name: "keyboard" }, price: 1000, brands: { brandname: "BrandX" } },
                { id: 2, name: "Mouse B", category: { name: "mouse" }, price: 500, brands: { brandname: "BrandY" } },
            ],
            productsLoading: false,
        }));

        usePriceStore.mockImplementation(() => ({ price: [0, 2000] }));
        useBrandStore.mockImplementation(() => ({ selectedBrand: [] }));
        useCategoryStore.mockImplementation(() => ({ categoryMenu: "" }));

        await act(async () => {
            render(
                <ConfigProvider>
                    <MemoryRouter>
                        <ProductList />
                    </MemoryRouter>
                </ConfigProvider>
            );
        });
    });

    afterEach(() => {
        cleanup();
    });

    it("should display all products initially", async () => {
        await waitForElementToBeRemoved(() => screen.getByText("กำลังโหลดข้อมูล..."), { timeout: 10000 });

        await waitFor(() => {
            expect(screen.getByText(/Keyboard A/i)).toBeInTheDocument();
            expect(screen.getByText(/Mouse B/i)).toBeInTheDocument();
        }, { timeout: 15000 });
    }, 20000);

    it("should filter products by category", async () => {
        useCategoryStore.mockImplementationOnce(() => ({ categoryMenu: "keyboard" }));

        await act(async () => {
            render(
                <ConfigProvider>
                    <MemoryRouter>
                        <ProductList />
                    </MemoryRouter>
                </ConfigProvider>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(/Keyboard A/i)).toBeInTheDocument();
            expect(screen.queryByText(/Mouse B/i)).not.toBeInTheDocument();
        }, { timeout: 15000 });
    }, 20000);

    it("should filter products by price range", async () => {
        usePriceStore.mockImplementationOnce(() => ({ price: [600, 2000] }));

        await act(async () => {
            render(
                <ConfigProvider>
                    <MemoryRouter>
                        <ProductList />
                    </MemoryRouter>
                </ConfigProvider>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(/Keyboard A/i)).toBeInTheDocument();
            expect(screen.queryByText(/Mouse B/i)).not.toBeInTheDocument();
        }, { timeout: 15000 });
    }, 20000);

    it("should filter products by brand", async () => {
        useBrandStore.mockImplementationOnce(() => ({ selectedBrand: ["BrandX"] }));

        await act(async () => {
            render(
                <ConfigProvider>
                    <MemoryRouter>
                        <ProductList />
                    </MemoryRouter>
                </ConfigProvider>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(/Keyboard A/i)).toBeInTheDocument();
            expect(screen.queryByText(/Mouse B/i)).not.toBeInTheDocument();
        }, { timeout: 15000 });
    }, 20000);
});
