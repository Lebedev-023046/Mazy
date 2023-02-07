import Layout from "@/components/Layout";
import { ProductItem } from "@/components/ProductItem";
import { data } from "@/utils/data";
// import { IProduct } from "@/types";
import React from "react";

export default function Home() {
  // useEffect(() => {
  //   try {
  //     fetch("data.json")
  //       .then((res) => res.json())
  //       .then((data) => setGoods(data));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </Layout>
  );
}
