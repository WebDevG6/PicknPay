import React, { useEffect, useState } from "react";
import { Divider, Button, Input, message, Form } from "antd";
import CartItemList from "../../components/CartItemList";
import { useCartItem } from "../../hooks/query";
import { loadStripe } from "@stripe/stripe-js";
import ax from "../../conf/ax";
import conf from "../../conf/main";

function Cart() {
    const stripePromise = loadStripe(
        "pk_test_51QrA19IqshdqteMviIRbdDZP1v9Xmuhq5toGui7qILPAkvoZyx2Kz4GQfzDzRVD2zl5pPzyDLeTYKYA04he3CTuF00eBRJw9RM"
    );
    const { data: cartItems } = useCartItem();
    const [cartSelectedItem, setSelectItem] = useState([]);
    const [discount, setDiscount] = useState({ value: 0, type: null, couponId: null });
    const [form] = Form.useForm();

    useEffect(() => {
        const selectedItems = cartItems.filter((item) => item.isSelect);
        const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalDiscount = discount.type === "amount" ? discount.value : (discount.value * totalPrice) / 100;

        setSelectItem({
            quantity: totalQuantity,
            price: totalPrice,
            discount: totalDiscount,
            deliveryCost: 0,
            summaryPrice: totalPrice - totalDiscount,
        });
    }, [cartItems, discount]);

    const handlePayment = async () => {
        if (cartSelectedItem.quantity === 0) {
            message.error("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");
            return;
        }
        try {
            const selectedItems = cartItems.filter((item) => item.isSelect);
            const stripe = await stripePromise;
            const res = await ax.post(conf.orderEndpoint(), {
                order_items: selectedItems,
                couponId: discount.couponId,
                value: cartSelectedItem.summaryPrice,
            });

            await stripe.redirectToCheckout({
                sessionId: res.data.stripeSession.id,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleCoupon = async (values) => {
        if (cartSelectedItem.quantity === 0) {
            message.error("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");
            return;
        }
        const couponCode = values.coupon?.trim();
        if (!couponCode) {
            message.error("กรุณากรอกโค้ดส่วนลด");
            return;
        }

        try {
            const response = await ax.post(conf.validateCouponEndpoint, { coupon: couponCode });
            if (response.data.valid) {
                setDiscount({
                    value: response.data.amount_off || response.data.percent_off,
                    type: response.data.percent_off ? "percent" : "amount",
                    couponId: couponCode,
                });
                message.success(
                    `ใช้โค้ดสำเร็จ! ลดราคา ${
                        response.data.amount_off ? `฿${response.data.amount_off}` : `${response.data.percent_off}%`
                    }`
                );
            } else {
                message.error("โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว");
                setDiscount({ value: 0, type: null, couponId: null });
                form.resetFields();
            }
        } catch (error) {
            console.error(error);
            message.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
            form.resetFields();
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 font-[Kanit] items-baseline">
                <p className="text-2xl font-semibold tracking-wide">รถเข็นของฉัน</p>
                <p className="text-xl">(สินค้า {cartSelectedItem.quantity} ชิ้น)</p>
            </div>
            <div className="flex lg:flex-row flex-col-reverse gap-4">
                <div className="bg-white lg:w-[70%] w-full rounded-sm p-4">
                    <CartItemList dataSource={cartItems} />
                </div>
                <div className="bg-white lg:w-[30%] w-full rounded-sm p-4 font-[Kanit]">
                    <div className="flex flex-col gap-4">
                        <p className="font-semibold tracking-wide">ใช้โค้ดส่วนลด</p>
                        <Form form={form} onFinish={handleCoupon}>
                            <div className="grid grid-cols-3">
                                <Form.Item name="coupon" style={{ marginBottom: 0, gridColumn: "span 2" }}>
                                    <Input
                                        placeholder="กรอกโค้ดส่วนลด"
                                        style={{
                                            width: "100%",
                                            height: 40,
                                            borderRadius: 5,
                                            borderTopRightRadius: 0,
                                            borderBottomRightRadius: 0,
                                            borderRight: 0,
                                            fontFamily: "Kanit",
                                            fontWeight: 300,
                                            borderColor: discount.couponId ? "#4169E2" : undefined,
                                        }}
                                    />
                                </Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        gridColumn: 3,
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                        height: "100%",
                                        fontFamily: "Kanit",
                                        fontWeight: 600,
                                        letterSpacing: "0.025em",
                                    }}
                                >
                                    ใช้โค้ด
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <Divider style={{ background: "#D9D9D9" }} />
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold tracking-wide">สรุปการสั่งซื้อ</p>
                            <div className="flex flex-row justify-between font-light">
                                <p>ยอดรวมสินค้า ({cartSelectedItem.quantity} ชิ้น)</p>
                                <p>฿{cartSelectedItem?.price?.toLocaleString("en-US")}</p>
                            </div>
                            <div className="flex flex-row justify-between font-light">
                                <p>โค้ดส่วนลด</p>
                                <p>฿{cartSelectedItem?.discount?.toLocaleString("en-US")}</p>
                            </div>
                            <div className="flex flex-row justify-between font-light">
                                <p>ค่าจัดส่ง</p>
                                <p>฿{cartSelectedItem?.deliveryCost?.toLocaleString("en-US")}</p>
                            </div>
                            <div className="flex flex-row justify-between font-semibold">
                                <p>ยอดสุทธิ</p>
                                <p>฿{cartSelectedItem?.summaryPrice?.toLocaleString("en-US")}</p>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            style={{
                                width: "100%",
                                height: 40,
                                borderRadius: 5,
                            }}
                            onClick={handlePayment}
                        >
                            <p className="font-semibold font-[Kanit] tracking-wide">สั่งซื้อ</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
