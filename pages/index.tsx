import Layout from "@/components/Layout";
import { ProductItem } from "@/components/ProductItem";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Product from "@/models/Product";
import { cartActions } from "@/store/reducers/cartSlice";
import { IDBProduct } from "@/types/ICart";
import db from "@/utils/db";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

interface IHomeProps {
  products: IDBProduct[];
}

export default function Home({ products }: IHomeProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cartReducer.cart.cartItems);

  const addToCartHandler = async (product: IDBProduct) => {
    const existItem = cartItems.find((elem) => elem.slug === product.slug);
    const quantityInCart = existItem ? existItem.quantityInCart + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.quantityInCart < quantityInCart) {
      toast.error("Sorry. Product is out of stock");
      return;
    }

    dispatch(
      cartActions.addCartItem({ ...product, quantityInCart: quantityInCart })
    );

    toast.success("Product added to the cart");
  };

  return (
    <Layout title="Mazy | Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            key={product.slug}
            product={product}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
