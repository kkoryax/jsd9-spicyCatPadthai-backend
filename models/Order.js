import mongoose, { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  total_price: { type: Number, required: true },
  order_status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdOn: { type: Date, default: new Date().getTime() },
  updated_at: { type: Date, default: new Date().getTime() },
  tracking_number: { type: String },
});

export const Order = model("Order", OrderSchema);
