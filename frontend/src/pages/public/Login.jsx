import React from "react";
import { useNavigate } from "react-router";
import { Button, Form, Input, Alert, Checkbox } from "antd";
import { useLogin, useRole } from "@hooks/auth";

function Login() {
    const navigate = useNavigate();
    const login = useLogin();
    const { refetch: getRole } = useRole();

    const handleLogin = async (formData) => {
        await login.mutateAsync(formData, {
            onSuccess: () => {
                getRole().then((role) => {
                    if (role.data === "Customer") {
                        navigate("/", { replace: true });
                    } else if (role.data === "Admin") {
                        navigate("/admin", { replace: true });
                    }
                });
            },
        });
    };

    return (
        <div className="flex flex-col gap-6 min-w-[0] p-5 sm:p-0 sm:min-w-[350px]">
            <div className=" flex flex-col gap-3">
                <p className="text-4xl font-semibold">
                    ยินดีต้อนรับกลับ<a className="text-[#4169E2]">!</a>
                </p>
                <p className="text-xs text-gray-500">
                    ยังไม่มีบัญชีใช่ไหม?{" "}
                    <a
                        onClick={() => navigate("/register")}
                        className="text-[#4169E2] hover:text-blue-400 cursor-pointer transition-colors duration-200"
                    >
                        สมัครสมาชิก
                    </a>
                </p>
            </div>
            <Form
                onFinish={handleLogin}
                autoComplete="off"
                className="w-[100%]"
                style={{ justifyItems: "center" }}
                requiredMark={false}
                layout="vertical"
            >
                {login.isError && (
                    <Form.Item style={{ width: "100%" }}>
                        <Alert
                            message={
                                login.error.response?.data?.error?.message ||
                                "การเข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง."
                            }
                            type="error"
                        />
                    </Form.Item>
                )}
                <Form.Item
                    name="identifier"
                    label="อีเมล"
                    rules={[{ required: true, type: "email" }]}
                    style={{ width: "100%" }}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="รหัสผ่าน" rules={[{ required: true }]} style={{ width: "100%" }}>
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" label={null} style={{ width: "100%" }}>
                    <Checkbox style={{ userSelect: "none" }}>จดจำฉันไว้</Checkbox>
                </Form.Item>

                <Form.Item style={{ width: "100%" }}>
                    <Button
                        style={{ width: "100%", height: "42px" }}
                        type="primary"
                        htmlType="submit"
                        loading={login.isPending}
                    >
                        เข้าสู่ระบบ
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;
