import { IDBProduct } from "@/types/ICart";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IProductItemProps {
  product: IDBProduct;
  // eslint-disable-next-line no-unused-vars
  addToCartHandler: (product: IDBProduct) => Promise<void>;
}

export const ProductItem: React.FC<IProductItemProps> = ({
  product,
  addToCartHandler,
}) => {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={product.image}
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
        <p>{product.price} BYN</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};
