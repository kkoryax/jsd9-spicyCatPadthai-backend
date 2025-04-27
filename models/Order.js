import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  total_price: { type: Number, required: true },
  tracking_number: { type: String }, // Assuming 'Type' in the diagram meant String
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  shipping_address: { type: String, required: true },
  order_status: { type: String },
});

export const Order = model("Order", OrderSchema);
