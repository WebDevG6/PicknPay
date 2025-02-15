import React, { useEffect, useState, useContext } from "react";
import { Divider, Button, Input } from "antd";
import CartItemList from "../components/CartItemList";
import { useCartItem } from "../hooks/query";

function Cart() {
    const { data: cartItems } = useCartItem();
    const [cartSelectedItem, setSelectItem] = useState([]);

    useEffect(() => {
        const selectedItems = cartItems.filter((item) => item.isSelect);
        const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        setSelectItem({
            quantity: totalQuantity,
            price: totalPrice,
            discount: 0,
            deliveryCost: 0,
        });
    }, [cartItems]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 font-[Kanit] items-baseline ">
                <p className="text-2xl font-semibold tracking-wide">รถเข็นของฉัน</p>
                <p className="text-xl">(สินค้า {cartSelectedItem.quantity} ชิ้น)</p>
            </div>
            <div className="grid grid-cols-24 gap-4">
                <div className="bg-white col-span-17 rounded-sm p-4">
                    <CartItemList dataSource={cartItems} />
                </div>
                <div className="bg-white col-span-7 rounded-sm p-4 font-[Kanit] ">
                    <div className="flex flex-col gap-4">
                        <p className="font-semibold tracking-wide">ใช้โค้ดส่วนลด</p>
                        <div className="grid grid-cols-3">
                            <Input
                                placeholder="กรอกโค้ดส่วนลด"
                                style={{
                                    width: "100%",
                                    height: 40,
                                    borderRadius: 5,
                                    gridColumn: "span 2",
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    borderRight: 0,
                                    fontFamily: "Kanit",
                                    fontWeight: 300,
                                }}
                            ></Input>
                            <Button
                                type="primary"
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
                                <p>฿{cartSelectedItem?.price?.toLocaleString("en-US")}</p>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            style={{
                                width: "100%",
                                height: 40,
                                borderRadius: 5,
                            }}
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
