import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Login from "@pages/public/Login";
import { useLogin, useRole } from "@hooks/auth";

// Mock hooks
vi.mock("@hooks/auth", () => ({
    useLogin: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isError: false,
        isPending: false,
    })),
    useRole: vi.fn(() => ({
        refetch: vi.fn(() => Promise.resolve({ data: "Admin" })),
    })),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate, // กำหนดค่าให้ `useNavigate` อย่างชัดเจน
    };
});
describe("Login Component", () => {
    let mockLogin, mockRole, mockNavigate;

    beforeEach(() => {
        mockLogin = {
            mutateAsync: vi.fn(),
            isPending: false,
            isError: false,
            error: null,
        };
        mockRole = { refetch: vi.fn() };
        mockNavigate = vi.fn();

        useLogin.mockReturnValue(mockLogin);
        useRole.mockReturnValue(mockRole);

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    });

    it("should render login form correctly", () => {
        expect(screen.getByLabelText("อีเมล")).toBeInTheDocument();
        expect(screen.getByLabelText("รหัสผ่าน")).toBeInTheDocument();
        expect(screen.getByText("เข้าสู่ระบบ")).toBeInTheDocument();
    });

    it("should show error message on login failure", async () => {
        mockLogin = {
            ...mockLogin,
            isError: true,
            error: {
                response: {
                    data: { error: { message: "Invalid credentials" } },
                },
            },
        };

        useLogin.mockReturnValue(mockLogin);

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    it("should call login function when submitting form", async () => {
        const emailInput = screen.getByLabelText("อีเมล");
        const passwordInput = screen.getByLabelText("รหัสผ่าน");
        const submitButton = screen.getByText("เข้าสู่ระบบ");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin.mutateAsync).toHaveBeenCalledWith(
                { identifier: "test@example.com", password: "password123" },
                expect.any(Object)
            );
        });
    });
});
