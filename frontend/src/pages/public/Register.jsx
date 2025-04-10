import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Form, Input, Alert } from "antd";
import RegisterBar from "@components/public/RegisterBar";
import { useRegister, useProfile } from "@hooks/auth";

const { TextArea } = Input;

function Register() {
    const [checkStep, setCheckStep] = useState(0);
    const [registerForm] = Form.useForm();
    const [registerData, setRegisterData] = useState();
    const register = useRegister();
    const changeProfile = useProfile();
    const navigate = useNavigate();

    const handleRegister = async () => {
        const addressData = await registerForm.validateFields();
        await register.mutateAsync(registerData, {
            onSuccess: (data) => {
                changeProfile.mutate(
                    {
                        userId: data.user.id,
                        firstName: registerData.firstName,
                        lastName: registerData.lastName,
                        address: addressData.address,
                    },
                    {
                        onSuccess: () => {
                            navigate("/", { replace: true });
                        },
                    }
                );
            },
            onError: () => {
                setCheckStep(0);
            },
        });
    };

    return (
        <div className="flex flex-col gap-6 min-w-[0] p-5 sm:p-0 sm:min-w-[350px]">
            <div className=" flex flex-col gap-3">
                <p className="text-4xl font-semibold">
                    สร้างบัญชีใหม่<a className="text-[#4169E2]">.</a>
                </p>
                <p className="text-xs text-gray-500">
                    มีบัญชีแล้วใช่ไหม?{" "}
                    <a
                        onClick={() => navigate("/login")}
                        className="text-[#4169E2] hover:text-blue-400 cursor-pointer transition-colors duration-200"
                    >
                        เข้าสู่ระบบ
                    </a>
                </p>
            </div>
            <RegisterBar stage={checkStep} />
            <Form
                autoComplete="off"
                className="w-[100%]"
                style={{ justifyItems: "center" }}
                requiredMark={false}
                form={registerForm}
                layout="vertical"
            >
                {register.isError && (
                    <Form.Item style={{ width: "100%" }}>
                        <Alert
                            message={
                                register.error.response?.data?.error?.message ||
                                "การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง."
                            }
                            type="error"
                        />
                    </Form.Item>
                )}

                {checkStep === 0 ? (
                    <>
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0 w-[100%]">
                            <Form.Item name="firstName" label="ชื่อ" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="lastName" label="นามสกุล" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="email"
                            label="อีเมล"
                            rules={[{ required: true, type: "email" }]}
                            style={{ width: "100%" }}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="รหัสผ่าน"
                            rules={[{ required: true, min: 8 }]}
                            style={{ width: "100%" }}
                        >
                            <Input.Password />
                        </Form.Item>
                    </>
                ) : (
                    <Form.Item style={{ width: "100%" }} name="address" label="ที่อยู่">
                        <TextArea autoSize={{ minRows: 3, maxRows: 9 }} />
                    </Form.Item>
                )}

                <Form.Item className="w-full">
                    <div className={`grid gap-5 ${checkStep === 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {checkStep === 1 && (
                            <Button
                                className="w-full"
                                style={{ height: "42px", marginTop: "16px" }}
                                onClick={() => {
                                    setCheckStep(0);
                                }}
                            >
                                ย้อนกลับ
                            </Button>
                        )}
                        <Button
                            className="w-full"
                            style={{ height: "42px", marginTop: "16px" }}
                            type="primary"
                            onClick={async () => {
                                if (checkStep === 1) {
                                    handleRegister();
                                } else {
                                    const firstForm = await registerForm.validateFields();
                                    setRegisterData(firstForm);
                                    setCheckStep(1);
                                }
                            }}
                            loading={register.isPending}
                        >
                            {checkStep === 0 ? "ดำเนินการต่อ" : "ลงทะเบียน"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;
