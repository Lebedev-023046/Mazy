import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Product from "@/models/Product";
import { addCartItem } from "@/store/reducers/cartSlice";
import { IDBProduct } from "@/types/ICart";
import db from "@/utils/db";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";

interface IContext {
  params: {
    slug: string;
  };
}

interface IProductScreen {
  product: IDBProduct;
}

export default function ProductScreen(props: IProductScreen) {
  const { product } = props;
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cartSlice.cart);
  const router = useRouter();
  if (!product) {
    return <Layout title="Product Not Found">Product Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = cartItems.find((elem) => elem.slug === product.slug);
    const productCount = existItem ? existItem.productCount + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.quantity < productCount) {
      return toast.error("Sorry. Product is out of stock");
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

export async function getServerSideProps({ params }: IContext) {
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
