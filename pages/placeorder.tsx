import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { cartActions } from "@/store/reducers/cartSlice";
import { getError } from "@/utils/error";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function PlaceOrderScreen() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cartReducer.cart);

  const cartItems = useAppSelector((state) => state.cartReducer.cart.cartItems);
  const shippingAddress = useAppSelector(
    (state) => state.cartReducer.cart.shippingAddress
  );
  const paymentMethod = useAppSelector(
    (state) => state.cartReducer.cart.paymentMethod
  );

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function round2(num: number): number {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  }

  async function handlePlaceOrder() {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch(cartActions.resetCartItems());
      Cookies.set("cart", JSON.stringify({ ...cart, cartItems: [] }));
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  }

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantityInCart * c.price, 0)
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeSteps={3} />
      <h1 className="mb-4 text-xl">Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href={"/"}>Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div className="mb-1">
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              <div>
                <Link href={"/shipping"}>Edit</Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href={"/payment"}>Edit</Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="py-5 text-left">Item</th>
                    <th className="py-5 text-left">Quantity</th>
                    <th className="py-5 text-left">Price</th>
                    <th className="py-5 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((product) => (
                    <tr key={product.slug} className="border-b">
                      <td className="py-5 text-left">
                        <Link
                          href={`/product/${product.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="w-auto h-auto"
                          />
                          &nbsp;
                          {product.name}
                        </Link>
                      </td>
                      <td className="py-5 text-left">
                        {product.quantityInCart}
                      </td>
                      <td className="py-5 text-left">{product.price}</td>
                      <td className="py-5 text-left">
                        {product.quantityInCart * product.price} BYN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href={"/cart"} className="py-5">
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="text-lg mb-2">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>{itemsPrice} BYN</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>{taxPrice} BYN</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>{shippingPrice} BYN</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>{totalPrice} BYN</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={handlePlaceOrder}
                    className="primary-button w-full"
                  >
                    {loading ? "loading" : "Place Order"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
export default PlaceOrderScreen;
