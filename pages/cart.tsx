import React from "react";
import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { cartActions } from "@/store/reducers/cartSlice";
import { ICartProduct } from "@/types";
import { XCircleIcon } from "@heroicons/react/24/outline";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

function CartScreen() {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cartReducer.cart.cartItems);
  const dispatch = useAppDispatch();

  const removeItemHandler = (item: ICartProduct) => {
    dispatch(cartActions.removeCartItem(item));
  };

  const updateCartHandler = async (item: ICartProduct, quantity: string) => {
    const quantityInCart = Number(quantity);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantityInCart) {
      return toast.error("Sorry. Product is out of stock");
    }
    dispatch(cartActions.addCartItem({ ...item, quantityInCart }));
    toast.success("Product updated in the cart");
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 ">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((elem) => (
                  <tr key={elem.slug} className="border-b">
                    <td>
                      <Link
                        className="flex items-center"
                        href={`/products/${elem.slug}`}
                      >
                        <Image
                          src={elem.image}
                          alt={elem.name}
                          width={50}
                          height={50}
                        ></Image>
                        &nbsp;
                        {elem.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={elem.quantityInCart}
                        onChange={(e) =>
                          updateCartHandler(elem, e.target.value)
                        }
                      >
                        {[...Array(elem.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">{elem.price} BYN</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(elem)}>
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal (
                  {cartItems.reduce(
                    (acc, elem) => acc + elem.quantityInCart,
                    0
                  )}
                  ) :{" "}
                  {cartItems.reduce(
                    (acc, elem) => acc + elem.quantityInCart * elem.price,
                    0
                  )}{" "}
                  BYN
                </div>
              </li>
              <li>
                <button
                  className="primary-button w-full"
                  onClick={() => router.push("login?redirect=/shipping")}
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
