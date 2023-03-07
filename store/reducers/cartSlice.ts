import { ICartProduct } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface IStateFields {
  cart: {
    cartItems: ICartProduct[];
  };
}

const initialState: IStateFields = {
  cart: {
    cartItems: Cookies.get("cart")
      ? JSON.parse(String(Cookies.get("cart")))
      : [],
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
      Cookies.set("cart", JSON.stringify([...cartItems]));
      state.cart.cartItems = [...cartItems];
    },
    removeCartItem: (state, action: PayloadAction<ICartProduct>) => {
      const itemToRemove = action.payload;
      const updatedItemList = state.cart.cartItems.filter(
        (elem) => elem.id !== itemToRemove.id
      );
      Cookies.set("cart", JSON.stringify([...updatedItemList]));
      state.cart.cartItems = updatedItemList;
    },
    resetCart: (state) => {
      state.cart = {
        cartItems: [],
      };
    },
  },
});

export const { addCartItem, removeCartItem, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
