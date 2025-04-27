import { Schema, model } from "mongoose";

const PaymentSchema = new Schema({
  amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  payment_status: { type: String, required: true },
  payment_date: { type: Date, default: Date.now },
});

export const Payment = model("Payment", PaymentSchema);
