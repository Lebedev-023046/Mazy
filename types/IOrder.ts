import mongoose from "mongoose";
import { ICartProduct } from "./ICart";

export interface IOrder {
  user: mongoose.Schema.Types.ObjectId;
  orderItems: ICartProduct[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult: { id: string; status: string; email_address: string };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: Date;
  deliveredAt: Date;
}

export interface IDBOrder extends IOrder {
  _id: string;
}
