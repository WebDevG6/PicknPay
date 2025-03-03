import { useContext } from "react";
import { useNavigate } from "react-router";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { InputNumber, Tag } from "antd";
import { useUpdateCartItem, useDeleteCartItem } from "@hooks/query";
import { authContext } from "@context/AuthContext";

function CartItemList({ dataSource }) {
    const { updateUserInfo } = useContext(authContext);
    const updateCartItem = useUpdateCartItem();
    const deleteCartItem = useDeleteCartItem();
    const navigate = useNavigate();

    const handleCheck = async ({ itemId, itemIsSelect }) => {
        await updateCartItem.mutateAsync({ itemId: itemId, data: { isSelect: !itemIsSelect } });

        updateUserInfo((prev) => ({
            ...prev,
            cart_id: {
                ...prev.cart_id,
                cart_items_id: prev.cart_id.cart_items_id.map((item) =>
                    item.documentId === itemId ? { ...item, isSelect: !itemIsSelect } : item
                ),
            },
        }));
    };

    const handleDelete = async (itemId) => {
        await deleteCartItem.mutateAsync({ itemId: itemId });

        updateUserInfo((prev) => ({
            ...prev,
            cart_id: {
                ...prev.cart_id,
                cart_items_id: prev.cart_id.cart_items_id.filter((item) => item.documentId !== itemId),
            },
        }));
    };

    const handleChangeQuantity = async ({ value, itemId }) => {
        await updateCartItem.mutateAsync({ itemId: itemId, data: { quantity: value } });
        updateUserInfo((prev) => ({
            ...prev,
            cart_id: {
                ...prev.cart_id,
                cart_items_id: prev.cart_id.cart_items_id.map((item) =>
                    item.documentId === itemId ? { ...item, quantity: value } : item
                ),
            },
        }));
    };

    return (
        <div className="relative overflow-x-auto font-[Kanit]">
            <table className="w-full text-sm text-center  table-fixed">
                <thead className="text-base">
                    <tr className="border-b-1 border-[#D9D9D9]">
                        <th scope="col" className="p-4 w-[50px]"></th>
                        <th scope="col" className="px-6 py-3 font-semibold w-[300px]">
                            สินค้า
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold w-[100px]">
                            ราคา
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold w-[100px]">
                            จำนวน
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold w-[50px]"></th>
                    </tr>
                </thead>
                <tbody>
                    {dataSource?.map((item) => (
                        <tr key={item.id} className="border-t-1 border-[#D9D9D9]">
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    {item.productStock !== 0 && (
                                        <Checkbox
                                            checked={item.isSelect}
                                            onChange={() =>
                                                handleCheck({ itemId: item.documentId, itemIsSelect: item.isSelect })
                                            }
                                            className="transition group size-4.5 rounded-sm p-1 ring-2 ring-[#D9D9D9] data-[checked]:ring-[#466EE4] ring-inset data-[checked]:bg-[#466EE4] bg-[#F5F5F5] cursor-pointer"
                                        >
                                            <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block translate-x-[-3.2px] translate-y-[-3px]" />
                                        </Checkbox>
                                    )}
                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-light flex flex-row gap-4">
                                <img src={item.imageUrl} className="w-28 h-28 object-cover rounded-sm" />
                                <div className="flex flex-col justify-between text-left py-2 gap-1.5">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-lg">{item.productName}</p>
                                        {item.productDiscountAmount ? (
                                            <div className="flex flex-row gap-1 items-center">
                                                <div className=" bg-red-500 text-white px-3 py-1 rounded-md font-semibold text-xs">
                                                    ลด {((item.productDiscountAmount / item.price) * 100).toFixed(0)}%
                                                </div>
                                                <p className="text-sm font-semibold">
                                                    ฿{(item.price - item.productDiscountAmount).toLocaleString("en-US")}
                                                </p>

                                                <p className="line-through text-xs text-gray-500">
                                                    ฿{item.price.toLocaleString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm">฿{item.price.toLocaleString("en-US")}</p>
                                        )}
                                    </div>
                                    <p
                                        onClick={() => navigate(`/products/${item.productId}`)}
                                        className="text-xs text-gray-500 cursor-pointer hover:underline"
                                    >
                                        รายละเอียดเพิ่มเติม
                                    </p>
                                </div>
                            </th>

                            <td className="px-6 py-4 text-xl">
                                ฿{((item.price - item.productDiscountAmount) * item.quantity).toLocaleString("en-US")}
                            </td>
                            <td className="px-6 py-4">
                                {item.productStock === 0 ? (
                                    <Tag color="error">
                                        <p className="text-base">สินค้าหมด</p>
                                    </Tag>
                                ) : (
                                    <InputNumber
                                        min={1}
                                        max={item.productStock}
                                        value={item.quantity}
                                        style={{ width: "80px", textAlign: "center" }}
                                        onChange={(value) =>
                                            handleChangeQuantity({ value: value, itemId: item.documentId })
                                        }
                                    />
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => handleDelete(item.documentId)}
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
