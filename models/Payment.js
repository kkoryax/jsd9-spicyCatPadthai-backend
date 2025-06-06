import mongoose, { Schema, model } from "mongoose";

const PaymentSchema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  amount: { type: Number, required: true },
  payment_method: {
    type: String,
    enum: ["promptpay", "creditcard"],
    default: "promptpay",
  },
  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  payment_date: { type: Date, default: new Date().getTime() },
});

export const Payment = model("Payment", PaymentSchema);
