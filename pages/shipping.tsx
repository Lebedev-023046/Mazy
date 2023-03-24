import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { saveShippingAddress } from "@/store/reducers/cartSlice";
import { IShippingAddress } from "@/types/ICart";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ShippingScreen() {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cartSlice);
  const { shippingAddress } = cart;

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<IShippingAddress>();

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }: IShippingAddress) => {
    dispatch(
      saveShippingAddress({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );

    router.push("/payment");
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeSteps={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="text-xl mb-4">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">FullName</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "Please enter full name",
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            className="w-full"
            id="address"
            autoFocus
            {...register("address", {
              required: "Please enter address",
              minLength: {
                value: 3,
                message: "Address must be at least 3 chars",
              },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            className="w-full"
            id="city"
            autoFocus
            {...register("city", {
              required: "Please enter city",
            })}
          />
          {errors.city && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className="w-full"
            id="postalCode"
            autoFocus
            {...register("postalCode", {
              required: "Please enter postalCode",
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full"
            id="country"
            autoFocus
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {errors.country && (
            <div className="text-red-500">{errors?.country?.message}</div>
          )}
        </div>
        <div className="flex justify-between mb-4">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
