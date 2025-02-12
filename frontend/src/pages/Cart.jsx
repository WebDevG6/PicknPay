import React, { useState } from "react";
import { Divider, Button } from "antd";
import CartItemList from "../components/CartItemList";

function Cart() {
    const cartSelectedItem = {
        quantity: 3,
        price: 6370,
        discount: 0,
        deliveryCost: 0,
    };

    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            imageUrl:
                "https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2023/12/Product/lg-27mr400-b-27-ips-fhd-monitor-100hz-front-view.jpg",
            productName: "test",
            price: 3790,
            quantity: 1,
            isSelect: true,
        },
        {
            id: 2,
            imageUrl:
                "https://www.converse.co.th/media/catalog/product/cache/8fcecb462959d400cda3532b9c3dc9f0/a/1/a12712c_a_08x1_1.png",
            productName: "test2",
            price: 1280,
            quantity: 2,
            isSelect: false,
        },
    ]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 font-[Kanit] items-baseline ">
                <p className="text-2xl font-semibold tracking-wide">รถเข็นของฉัน</p>
                <p className="text-xl">(สินค้า {cartSelectedItem.quantity} ชิ้น)</p>
            </div>
            <div className="grid grid-cols-24 gap-4">
                <div className="bg-white col-span-17 rounded-sm p-4">
                    <CartItemList dataSource={cartItems} setCartItems={setCartItems} />
                </div>
                <div className="bg-white col-span-7 rounded-sm p-4 font-[Kanit] ">
                    <div>
                        <p className="font-semibold tracking-wide">ใช้โค้ดส่วนลด</p>
                    </div>
                    <Divider style={{ background: "#D9D9D9" }} />
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold tracking-wide">สรุปการสั่งซื้อ</p>
                            <div className="flex flex-row justify-between font-light">
                                <p>ยอดรวมสินค้า ({cartSelectedItem.quantity} ชิ้น)</p>
                                <p>฿{cartSelectedItem.price}</p>
                            </div>
                            <div className="flex flex-row justify-between font-light">
                                <p>โค้ดส่วนลด</p>
                                <p>฿{cartSelectedItem.discount}</p>
                            </div>
                            <div className="flex flex-row justify-between font-light">
                                <p>ค่าจัดส่ง</p>
                                <p>฿{cartSelectedItem.deliveryCost}</p>
                            </div>
                            <div className="flex flex-row justify-between font-semibold">
                                <p>ยอดสุทธิ</p>
                                <p>฿{cartSelectedItem.price}</p>
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
