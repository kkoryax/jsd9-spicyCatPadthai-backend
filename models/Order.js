import mongoose, { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  total_price: { type: Number, required: true },
  shipping_address: { type: String, required: true },
  order_status: { type: String },
  createdOn: { type: Date, default: new Date().getTime() },
  updated_at: { type: Date, default: new Date().getTime() },
  tracking_number: { type: String },
});

export const Order = model("Order", OrderSchema);
