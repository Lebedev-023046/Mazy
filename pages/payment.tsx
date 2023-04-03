import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { savePaymentMethod } from "@/store/reducers/cartSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cartSlice);
  const { shippingAddress, paymentMethod } = cart;
  const router = useRouter();

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment Method is Required");
    }
    dispatch(savePaymentMethod(selectedPaymentMethod));

    Cookies.set(
      "cart",
      JSON.stringify({ ...cart, paymentMethod: selectedPaymentMethod })
    );

    router.push("/placeorder");
  };

  useEffect(() => {
    (async function () {
      if (!shippingAddress.address) {
        return router.push("/shipping");
      }
      setSelectedPaymentMethod(paymentMethod || "");
    })();
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Payment Screen">
      <CheckoutWizard activeSteps={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {["Master Card", "Cash On Delivery"].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              type="radio"
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment}
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label htmlFor={payment} className="p-2">
              {payment}
            </label>
          </div>
        ))}
        <div className="flex justify-between mb-4">
          <button
            className="default-button"
            type="button"
            onClick={() => router.push("/shipping")}
          >
            Back
          </button>
          <button type="submit" className="primary-button">
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
}

PaymentScreen.auth = true;
export default PaymentScreen;
