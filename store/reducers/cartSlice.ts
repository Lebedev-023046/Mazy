import { ICartProduct } from "@/types";
import { IShippingAddress } from "@/types/ICart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface IStateFields {
  cart: {
    cartItems: ICartProduct[];
    shippingAddress: IShippingAddress;
    paymentMethod: string;
  };
}

const initialState: IStateFields = {
  cart: Cookies.get("cart")
    ? JSON.parse(String(Cookies.get("cart")))
    : {
        cartItems: [],
        shippingAddress: {
          fullName: "",
          address: "",
          city: "",
          postalCode: "",
          country: "",
        },
        paymentMethod: "",
      },
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem: (state, action: PayloadAction<ICartProduct>) => {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (elem) => elem.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((elem) =>
            elem.name === existItem.name ? newItem : elem
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set(
        "cart",
        JSON.stringify({
          ...initialState.cart,
          cartItems: [...cartItems],
        })
      );
      state.cart.cartItems = [...cartItems];
    },
    removeCartItem: (state, action: PayloadAction<ICartProduct>) => {
      const itemToRemove = action.payload;
      const updatedItemList = state.cart.cartItems.filter(
        (elem) => elem.slug !== itemToRemove.slug
      );
      Cookies.set(
        "cart",
        JSON.stringify({
          ...initialState.cart,
          cartItems: [...updatedItemList],
        })
      );

      state.cart.cartItems = updatedItemList;
    },
    resetCart: (state) => {
      state.cart = {
        cartItems: [],
        shippingAddress: {
          fullName: "",
          address: "",
          city: "",
          postalCode: "",
          country: "",
        },
        paymentMethod: "",
      };
    },
    resetCartItems: (state) => {
      state.cart.cartItems = [];
    },
    saveShippingAddress: (state, action: PayloadAction<IShippingAddress>) => {
      state.cart.shippingAddress = action.payload;
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.cart.paymentMethod = action.payload;
    },
  },
});

export const {
  addCartItem,
  removeCartItem,
  resetCart,
  resetCartItems,
  saveShippingAddress,
  savePaymentMethod,
} = cartSlice.actions;
export default cartSlice.reducer;
