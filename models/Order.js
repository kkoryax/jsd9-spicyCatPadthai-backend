import { Schema, model } from "mongoose";
import { OrderDetail } from "./OrderDetail.js"; 
import { Payment } from "./Payment.js";

const OrderSchema = new Schema({
  order_details: [OrderDetail], 
  payment: [Payment],
  total_price: { type: Number, required: true },
  updated_at: { type: Date, default: Date.now },
  shipping_address: { type: String, required: true },
  order_status: { type: String },
});

export const Order = model("Order", OrderSchema);