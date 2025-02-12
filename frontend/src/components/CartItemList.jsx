import React from "react";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";

function CartItemList({ dataSource, setCartItems }) {
    const handleCheck = (itemId) => {
        setCartItems(dataSource.map((item) => (item.id === itemId ? { ...item, isSelect: !item.isSelect } : item)));
    };

    const handleDelete = (itemId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    return (
        <div className="relative overflow-x-auto font-[Kanit]">
            <table className="w-full text-sm text-center">
                <thead className="text-base">
                    <tr className="border-b-1 border-[#D9D9D9]">
                        <th scope="col" className="p-4"></th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                            สินค้า
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                            ราคา
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                            จำนวน
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold"></th>
                    </tr>
                </thead>
                <tbody>
                    {dataSource?.map((item) => (
                        <tr key={item.id} className="border-t-1 border-[#D9D9D9]">
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={item.isSelect}
                                        onChange={() => handleCheck(item.id)}
                                        className="transition group size-4.5 rounded-sm p-1 ring-2 ring-[#D9D9D9] data-[checked]:ring-[#466EE4] ring-inset data-[checked]:bg-[#466EE4] bg-[#F5F5F5] cursor-pointer"
                                    >
                                        <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block translate-x-[-3.2px] translate-y-[-3px]" />
                                    </Checkbox>
                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-light flex flex-row gap-4">
                                <img src={item.imageUrl} className="w-28 h-28 object-cover rounded-sm" />
                                <div className="flex flex-col justify-between text-left">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xl">{item.productName}</p>
                                        <p className="text-sm">฿{item.price.toLocaleString("en-US")}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">รายละเอียดเพิ่มเติม</p>
                                </div>
                            </th>

                            <td className="px-6 py-4 text-xl">
                                ฿{(item.price * item.quantity).toLocaleString("en-US")}
                            </td>
                            <td className="px-6 py-4">Laptop</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-[#E8E8E8] hover:bg-red-500 hover:text-white text-[#797979] transition w-8 h-8  rounded-sm items-center flex justify-center cursor-pointer"
                                >
                                    <i className="fi fi-rs-trash text-base translate-y-[2px]" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CartItemList;
