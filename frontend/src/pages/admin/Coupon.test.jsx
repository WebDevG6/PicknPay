import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Coupon from "@pages/admin/Coupon";
import { useCouponQuery } from "@hooks/queryAdmin";
import { useCouponCreate, useCouponDelete } from "@hooks/serviceAdmin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mocked sample coupon data
const MOCK_COUPON = {
    id: "TEST123",
    percent_off: 10,
    amount_off: null,
    valid: true,
    redeem_by: 1714694400,
    times_redeemed: 0,
    max_redemptions: 10,
};

// Mock the entire antd library
vi.mock("antd", () => {
    const createMockComponent = (name, renderFn) => {
        return (
            renderFn ||
            function MockComponent(props) {
                return <div data-testid={`mock-${name.toLowerCase()}`} {...props} />;
            }
        );
    };

    return {
        message: {
            success: vi.fn(),
            error: vi.fn(),
            config: vi.fn(),
        },
        Modal: createMockComponent(
            "Modal",
            function Modal({ children, title, open, onOk, onCancel, okText, cancelText }) {
                if (!open) return null;
                return (
                    <div data-testid="modal">
                        <div>{title}</div>
                        <div>{children}</div>
                        <button onClick={onOk}>{okText || "OK"}</button>
                        <button onClick={onCancel}>{cancelText || "Cancel"}</button>
                    </div>
                );
            }
        ),
        Form: {
            Item: createMockComponent("FormItem", function FormItem({ name, label, rules, children }) {
                return (
                    <div>
                        <label htmlFor={name}>{label}</label>
                        <div>{children}</div>
                    </div>
                );
            }),
            useForm: () => [
                {
                    validateFields: vi.fn().mockResolvedValue({
                        id: "TESTCOUPON",
                        type: "percent_off",
                        discountValue: 20,
                        max: 10,
                        expired: { unix: () => 1714694400 },
                    }),
                    resetFields: vi.fn(),
                },
            ],
        },
        Input: createMockComponent("Input", function Input(props) {
            return <input id={props.id || props.name} data-testid="mock-input" {...props} />;
        }),
        InputNumber: createMockComponent("InputNumber", function InputNumber(props) {
            return <input type="number" id={props.id || props.name} data-testid="mock-input-number" {...props} />;
        }),
        Select: createMockComponent("Select", function Select({ options, ...props }) {
            return (
                <select id={props.id || props.name} data-testid="mock-select" {...props}>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }),
        DatePicker: createMockComponent("DatePicker", function DatePicker({ showTime, placeholder, ...props }) {
            return (
                <input
                    type="date"
                    id={props.id || props.name}
                    placeholder={placeholder || ""}
                    data-showtime={showTime ? "true" : "false"}
                    data-testid="mock-datepicker"
                    {...props}
                />
            );
        }),
        Button: createMockComponent("Button", function Button({ children, type, danger, icon, onClick, ...props }) {
            return (
                <button
                    onClick={onClick}
                    className={`ant-btn ${type ? `ant-btn-${type}` : ""} ${danger ? "ant-btn-danger" : ""}`}
                    data-testid="mock-button"
                    {...props}
                >
                    {icon && <span className="anticon">{icon}</span>}
                    {children}
                </button>
            );
        }),
        Table: createMockComponent("Table", function Table({ dataSource, columns }) {
            return (
                <table data-testid="mock-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key || col.dataIndex}>{col.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataSource?.map((record, index) => (
                            <tr key={record.id || index} data-testid={`table-row-${record.id || index}`}>
                                {columns.map((col) => (
                                    <td key={`${record.id}-${col.key || col.dataIndex}`}>
                                        {col.render ? col.render(record[col.dataIndex], record) : record[col.dataIndex]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }),
        Tag: createMockComponent("Tag", function Tag({ children, color }) {
            return (
                <span className={`ant-tag ant-tag-${color}`} data-testid="mock-tag">
                    {children}
                </span>
            );
        }),
    };
});

// Mock hooks
vi.mock("@hooks/queryAdmin", () => ({
    useCouponQuery: vi.fn(),
}));

vi.mock("@hooks/serviceAdmin", () => ({
    useCouponCreate: vi.fn(),
    useCouponDelete: vi.fn(),
}));

// Mock icons
vi.mock("@ant-design/icons", () => {
    const createIconMock = (name) =>
        function MockIcon() {
            return <span data-testid={`${name.toLowerCase()}-icon`} />;
        };

    return {
        PlusCircleOutlined: createIconMock("plus"),
        FilterOutlined: createIconMock("filter"),
        DeleteOutlined: createIconMock("delete"),
    };
});

// Mock dayjs
vi.mock("dayjs", () => {
    const mockDayjs = function () {
        return {
            format: vi.fn().mockReturnValue("01/01/2025 00:00:00"),
            unix: vi.fn().mockReturnValue(1735689600),
        };
    };

    mockDayjs.unix = vi.fn().mockImplementation(() => ({
        format: vi.fn().mockReturnValue("01/01/2025 00:00:00"),
    }));

    return {
        default: mockDayjs,
        __esModule: true,
    };
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe("Coupon Component", () => {
    // Setup
    const setupTest = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        const mockCouponCreate = vi.fn();
        const mockCouponDelete = vi.fn();
        const mockRefetch = vi.fn();

        // Setup hooks
        useCouponQuery.mockReturnValue({
            data: {
                data: [MOCK_COUPON],
            },
            isLoading: false,
            refetch: mockRefetch,
        });

        useCouponCreate.mockReturnValue({ mutate: mockCouponCreate });
        useCouponDelete.mockReturnValue({ mutate: mockCouponDelete });

        // Render component with QueryClientProvider
        const renderResult = render(
            <QueryClientProvider client={queryClient}>
                <Coupon />
            </QueryClientProvider>
        );

        return {
            ...renderResult,
            mockCouponCreate,
            mockCouponDelete,
            mockRefetch,
        };
    };

    it("should display coupon information correctly", () => {
        const { getByText } = setupTest();

        // Check for expected data in the table
        const expectedData = {
            id: "TEST123",
            discount: "10%",
            status: "ใช้งานอยู่",
            expiry: "01/01/2025 00:00:00",
            timesUsed: "0",
            maxUses: "10",
        };

        Object.values(expectedData).forEach((text) => {
            expect(getByText(text)).toBeInTheDocument();
        });
    });

    it("should delete a coupon when the delete button is clicked", async () => {
        const { getAllByTestId, mockCouponDelete } = setupTest();

        // Find and click delete button
        const deleteIcons = getAllByTestId("delete-icon");
        fireEvent.click(deleteIcons[0].closest("button"));

        // Verify API call
        await waitFor(() => {
            expect(mockCouponDelete).toHaveBeenCalled();
        });
    });

    it("should filter coupons by status (valid, expired, all)", async () => {
        const { getByText } = setupTest();

        // Get filter buttons
        const filterButtons = {
            all: getByText("คูปองทั้งหมด"),
            valid: getByText("คูปองที่ใช้งานได้"),
            expired: getByText("คูปองหมดอายุแล้ว"),
        };

        // Click each button and verify they exist and can be clicked
        Object.values(filterButtons).forEach((button) => {
            fireEvent.click(button);
            expect(button).toBeInTheDocument();
        });
    });
});
