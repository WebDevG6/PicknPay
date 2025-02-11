import React, { useState } from "react";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";

function CartItemList({ dataSource }) {
    const handleCheck = (itemId) => {};

    return (
        <div className="relative overflow-x-auto font-[Kanit]">
            <table className="w-full text-sm text-center">
                <thead className="text-base border-b-1 border-[#D9D9D9]">
                    <tr>
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
                        <tr class="">
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={item.isSelect}
                                        onChange={() => handleCheck(item.id)}
                                        className="transition group size-4.5 rounded-sm p-1 ring-2 ring-[#D9D9D9] data-[checked]:ring-[#466EE4] ring-inset data-[checked]:bg-[#466EE4] bg-[#F5F5F5]"
                                    >
                                        <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block translate-x-[-3.2px] translate-y-[-3px]" />
                                    </Checkbox>
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-light flex flex-row">
                                <img src={item.imageUrl} className="w-32 h-32 object-cover" />
                                <p>{item.productName}</p>
                            </th>
                            <td class="px-6 py-4">Laptop</td>
                            <td class="px-6 py-4">$2999</td>
                            <td class="px-6 py-4">delete</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CartItemList;
