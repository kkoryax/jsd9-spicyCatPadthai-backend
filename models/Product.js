import mongoose,{ Schema, model } from "mongoose";

export const ProductSchema = new Schema({
  name_vol: { type: String, required: true, unique: true },
  volume_no: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number},
  title_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Title",
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },

  //   picture: { type: String },
  product_status: {
    type: String,
    enum: ["available", "out of stock", "discontinued"],
    default: "available",
  },
  createdOn: { type: Date, default: new Date().getTime() },
});

export const Product = model("Product", ProductSchema);
