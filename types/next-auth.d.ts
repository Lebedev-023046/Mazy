// eslint-disable-next-line no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  export interface Session {
    _id: string;
    isAdmin: string;
    user: {
      _id: string;
      name: string;
      email: string;
      password: string;
      isAdmin: boolean;
    };
  }
  export interface User {
    _id: string;
    email: string;
    password: string;
    isAdmin: boolean;
  }
}
