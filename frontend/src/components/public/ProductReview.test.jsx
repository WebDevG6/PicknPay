import React from "react";
import { render } from "@testing-library/react";
import ProductReview from "@components/public/ProductReview";

vi.mock("dayjs", () => {
    const mockDayjs = function () {
        return {
            format: vi.fn().mockReturnValue("20/01/2024"),
        };
    };

    return {
        default: mockDayjs,
        __esModule: true,
    };
});

describe("ProductReview Component", () => {
    const mockReviews = [
        {
            displayName: "User 1",
            rating: 5,
            comment: "Excellent product!",
            createdAt: "2024-01-20T10:00:00Z",
        },
        {
            displayName: "User 2",
            rating: 4,
            comment: "Good product, but could be better.",
            createdAt: "2024-01-19T10:00:00Z",
        },
        {
            displayName: "User 3",
            rating: 5,
            comment: "Amazing!",
            createdAt: "2024-01-18T10:00:00Z",
        },
    ];

    const setupTest = (reviews = mockReviews) => {
        const renderResult = render(<ProductReview reviews={reviews} />);
        return {
            ...renderResult,
        };
    };

    it("should render average review and total reviews", () => {
        const { getByText } = setupTest();
        expect(getByText("4.7")).toBeInTheDocument();
    });

    it("should render latest reviews data correctly", () => {
        const { getByText, getAllByText } = setupTest();
        expect(getByText("User 1")).toBeInTheDocument();
        expect(getByText("Excellent product!")).toBeInTheDocument();
        expect(getByText("User 2")).toBeInTheDocument();
        expect(getByText("Good product, but could be better.")).toBeInTheDocument();
        expect(getByText("User 3")).toBeInTheDocument();
        expect(getByText("Amazing!")).toBeInTheDocument();
        expect(getAllByText("20/01/2024")).toHaveLength(3);
    });

    it("should render no reviews when reviews array is empty", () => {
        const { queryByText } = setupTest([]);
        expect(queryByText("รีวิวสินค้า")).toBeInTheDocument();
        expect(queryByText("รีวิวล่าสุด")).toBeInTheDocument();
        expect(queryByText("0")).toBeInTheDocument();
    });
});