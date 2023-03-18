import { IProduct } from "@/types";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    img: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: { type: [Number], required: true },
    year: { type: Number, required: true },
    rating: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
