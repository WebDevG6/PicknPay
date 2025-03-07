import { useEffect, useState, useContext } from "react";
import { Button, Form, Input, ConfigProvider, message } from "antd";
import { authContext } from "@context/AuthContext";
import { useProfile } from "@hooks/auth";

function Profile() {
    const [messageApi, contextHolder] = message.useMessage();
    const { userInfo, updateUserInfo } = useContext(authContext);
    const changeProfile = useProfile();
    const [change, setChange] = useState(false);
    const [form] = Form.useForm();

    const handleFinish = async () => {
        const data = await form.validateFields();
        await changeProfile.mutateAsync(
            {
                userId: userInfo.id,
                firstName: data.firstname,
                lastName: data.lastname,
                address: data.address,
            },
            {
                onSuccess: () => {
                    messageApi.open({
                        type: "success",
                        content: "บันทึกข้อมูลส่วนตัวสำเร็จ",
                        style: {
                            fontFamily: "Kanit",
                        },
                    });
                    updateUserInfo((prev) => ({
                        ...prev,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        address: data.address,
                    }));
                    setChange(false);
                },
                onError: () => {
                    messageApi.open({
                        type: "error",
                        content: "บันทึกข้อมูลส่วนตัวไม่สำเร็จ",
                        style: {
                            fontFamily: "Kanit",
                        },
                    });
                },
            }
        );
    };

    const handleValuesChange = (_, allValues) => {
        setChange(
            userInfo.firstname !== allValues.firstname ||
                userInfo.lastname !== allValues.lastname ||
                userInfo.address !== allValues.address
        );
    };

    useEffect(() => {
        form.setFieldsValue(userInfo);
    }, [form, userInfo]);
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "Kanit, sans-serif",
                },
                components: {
                    Form: {
                        labelFontSize: 18,
                    },
                },
            }}
        >
            {contextHolder}
            <div className="flex flex-col gap-2">
                <div>
                    <p className="text-2xl font-semibold tracking-wide font-[Kanit]">ข้อมูลส่วนตัว</p>
                </div>
                <div className=" bg-white p-8 rounded-sm w-full">
                    <Form
                        onFinish={handleFinish}
                        form={form}
                        layout="vertical"
                        onValuesChange={handleValuesChange}
                        requiredMark={false}
                    >
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0 w-full">
                            <Form.Item name="firstname" label="ชื่อ" rules={[{ required: true }]} className="w-full">
                                <Input placeholder="first name" />
                            </Form.Item>
                            <Form.Item name="lastname" label="นามสกุล" rules={[{ required: true }]} className="w-full">
                                <Input placeholder="last name" />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="email"
                            label="อีเมล"
                            rules={[{ required: true }]}
                            style={{ fontFamily: "Kanit" }}
                        >
                            <Input disabled placeholder="email" />
                        </Form.Item>
                        <Form.Item name="address" label="ที่อยู่" rules={[{ required: true }]}>
                            <Input.TextArea placeholder="address" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={!change}>
                                บันทึก
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </ConfigProvider>
    );
}
export default Profile;
