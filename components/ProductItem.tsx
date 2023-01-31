import { IProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IProductItemProps {
  product: IProduct;
}

export const ProductItem: React.FC<IProductItemProps> = ({ product }) => {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={product.img}
          alt={product.name}
          className="rounded shadow mx-auto"
          width={289}
          height={386}
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>{product.price} BYN</p>
        <button className="primary-button" type="button">
          Add to cart
        </button>
      </div>
    </div>
  );
};
