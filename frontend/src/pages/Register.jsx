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
    const [registerData, setRegisterData] = useState();
    const navigate = useNavigate();

    const handleRegister = async () => {
        const addressData = await registerForm.validateFields();
        try {
            setIsLoading(true);
            setErrMsg(null);
            const response = await ax.post(
                conf.registerEndpoint,
                {
                    email: registerData.email,
                    username: registerData.email,
                    password: registerData.password,
                },
                { withCredentials: false }
            );
            axData.jwt = response.data.jwt;
            Cookies.set("token", axData.jwt, {
                expires: null,
                path: "/",
            });
            await ax.put(conf.userEndpoint + response.data.user.id, {
                firstname: registerData.firstName,
                lastname: registerData.lastName,
                address: addressData.address,
            });
            navigate("/");
        } catch (err) {
            setErrMsg(err?.response?.data?.error?.message);
            setCheckStep(0);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 min-w-[0] p-5 sm:p-0 sm:min-w-[350px]">
            <div className=" flex flex-col gap-3">
                <p className="text-4xl font-semibold">
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
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0 w-[100%]">
                            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="email"
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
                    <Form.Item style={{ width: "100%" }} name="address" label="Address">
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
                                Back
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
