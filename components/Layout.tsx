import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux";

interface ILayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: ILayoutProps) {
  const { cartItems } = useAppSelector((state) => state.cartSlice.cart);
  return (
    <>
      <Head>
        <title>{title ? title : "Mazy"}</title>
        <meta
          name="description"
          content="Belarussian clothes brand e-commerce Website"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 justify-between shadow-md items-center px-4">
            <Link href={"/"} className="text-lg font-bold">
              Mazy
            </Link>
            <div>
              <Link href={"cart"} className="p-2">
                Cart
                {cartItems.length > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {cartItems.reduce(
                      (acc, elem) => acc + elem.productCount,
                      0
                    )}
                  </span>
                )}
              </Link>
              <Link href={"login"} className="p-2">
                Login
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          Copyright © 2022 Mazy
        </footer>
      </div>
    </>
  );
}
