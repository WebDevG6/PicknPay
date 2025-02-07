import React from "react";
import Cookies from "js-cookie";
import conf from "../conf/main";
import ax, { axData } from "../conf/ax";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Button, Form, Input, Alert } from "antd";
import RegisterBar from "../components/RegisterBar";
const { TextArea } = Input;

function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [checkStep, setCheckStep] = useState(0);
    const [errMsg, setErrMsg] = useState(null);
    const [registerForm] = Form.useForm();
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        try {
            setIsLoading(true);
            setErrMsg(null);
            const response = await ax.post(conf.loginEndpoint, formData);
            axData.jwt = response.data.jwt;
            Cookies.set("token", axData.jwt, {
                expires: formData.remember ? 30 : null,
                path: "/",
            });
            const responseUser = await ax.get(conf.jwtUserEndpoint, { withCredentials: false });
            const role = responseUser.data.role.name;
        } catch (err) {
            setErrMsg(err.response.data.error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-12 min-w-[400px]">
            <div className=" flex flex-col gap-3">
                <p className="text-4xl font-semibold flex flex-row">
                    Create new account<a className="text-[#4169E2]">.</a>
                </p>
                <p className="text-xs text-gray-500">
                    Already have an account?{" "}
                    <a
                        onClick={() => navigate("/login")}
                        className="text-[#4169E2] hover:text-blue-400 cursor-pointer transition-colors duration-200"
                    >
                        Log In
                    </a>
                </p>
            </div>
            <RegisterBar stage={checkStep} />
            <Form
                onFinish={handleRegister}
                autoComplete="off"
                className="w-[100%]"
                style={{ justifyItems: "center" }}
                requiredMark={false}
                form={registerForm}
                layout="vertical"
            >
                {errMsg && (
                    <Form.Item style={{ width: "100%" }}>
                        <Alert message={errMsg} type="error" />
                    </Form.Item>
                )}

                {checkStep === 0 ? (
                    <>
                        <div className="flex flex-row gap-4">
                            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="identifier"
                            label="Email"
                            rules={[{ required: true, type: "email" }]}
                            style={{ width: "100%" }}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, min: 8 }]}
                            style={{ width: "100%" }}
                        >
                            <Input.Password />
                        </Form.Item>
                    </>
                ) : (
                    <>
                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[{ required: true, min: 10 }]}
                            style={{ width: "100%" }}
                        >
                            <Input placeholder="099 9999 9999" />
                        </Form.Item>
                        <Form.Item style={{ width: "100%" }} name="address" label="Address">
                            <TextArea autoSize={{ minRows: 3, maxRows: 9 }} />
                        </Form.Item>
                    </>
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
                                Back
                            </Button>
                        )}
                        <Button
                            className="w-full"
                            style={{ height: "42px", marginTop: "16px" }}
                            type="primary"
                            onClick={async () => {
                                await registerForm.validateFields();
                                if (checkStep === 1) {
                                    console.log("register!");
                                } else {
                                    setCheckStep(1);
                                }
                            }}
                            loading={isLoading}
                        >
                            {checkStep === 0 ? "Continue" : "Register"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;
