import React from "react";
import { setupStore } from "@/store";
import "@/styles/global.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import { NextComponentType } from "next/types";

interface IAuthProps {
  children: any;
}

type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean };
};

const store = setupStore();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />;
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </SessionProvider>
  );
}

function Auth({ children }: IAuthProps) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });
  if (status === "loading") {
    return <div>Is loading...</div>;
  }
  return children;
}
