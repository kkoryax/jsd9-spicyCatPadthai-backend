import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const ProductSchema = new Schema({
  product_id: { type: String, default: uuidv4 },
  name_vol: { type: String, required: true, unique: true },
  volume_no: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  //   title_id: { type: mongoose.Schema.Types.ObjectId, ref: "Title" },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  //   picture: { type: String },
  product_status: {
    type: String,
    enum: ["available", "out of stock", "discontinued"],
    default: "available",
  },
  createdOn: { type: Date, default: Date.now },
});

export const Product = model("Product", ProductSchema);
