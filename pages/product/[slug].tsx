import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addCartItem } from "@/store/reducers/cartSlice";
import { data } from "@/utils/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function ProductScreen() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cartSlice.cart);
  const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = () => {
    const existItem = cartItems.find((elem) => elem.slug === product.slug);
    const productCount = existItem ? existItem.productCount + 1 : 1;

    if (product.quantity < productCount) {
      alert("Sorry. Product is out of stock");
      return;
    }

    dispatch(addCartItem({ ...product, productCount: productCount }));
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.img}
            alt={product.slug}
            width={320}
            height={520}
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Brand: {product.brand}</li>
            <li>Price: {product.price} BYN</li>
            <li>Quantity: {product.quantity}</li>
            <li>Year: {product.year}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div> {product.price} BYN</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Quantity</div>
              <div> {product.quantity > 0 ? "In Stock" : "Unavailable"}</div>
            </div>
          </div>

          <button className="primary-button w-full" onClick={addToCartHandler}>
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  );
}
