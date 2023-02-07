import { ICartProduct } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IStateFields {
  cart: {
    cartItems: ICartProduct[];
  };
}

const initialState: IStateFields = {
  cart: { cartItems: [] },
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
      state.cart.cartItems = [...cartItems];
    },
  },
});

export const { addCartItem } = cartSlice.actions;
export default cartSlice.reducer;
