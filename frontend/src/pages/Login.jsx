import { useState } from "react";
import { Button, Form, Input, Alert, Checkbox } from "antd";
import { useNavigate } from "react-router";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import conf from "../conf/main";
import ax, { axData } from "../conf/ax";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const navigate = useNavigate();

    async function handleLogin(formData) {
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
    }

    return (
        <div className="h-screen w-screen justify-center items-center text-white flex bg-linear-90 from-[#001628] to-[#1c64a3]">
            <div className="pt-12 pb-6   pl-6 pr-6 text-2xl justify-items-center bg-white text-black rounded-xl">
                <p className="text-5xl mb-12 font-bold">Login</p>
                <Form onFinish={handleLogin} autoComplete="off" className="w-[25vw] min-w-[200px]">
                    {errMsg && (
                        <Form.Item>
                            <Alert message={errMsg} type="error" />
                        </Form.Item>
                    )}
                    <Form.Item name="identifier" rules={[{ required: true }]}>
                        <Input placeholder="Username" prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true }]}>
                        <Input.Password placeholder="Password" prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" label={null}>
                        <Checkbox style={{ userSelect: "none" }}>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            style={{ width: "100%", height: "52px" }}
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        >
                            LOGIN
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
