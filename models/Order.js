import mongoose, { Schema, model } from "mongoose";

const paddedNumber = (num) => num.toString().padStart(2, "0");

const generateTrackingNumber = () => {
  const now = new Date();
  return `KB${now.getFullYear()}${paddedNumber(
    now.getMonth() + 1
  )}${paddedNumber(now.getDate())}${Math.floor(100 + Math.random() * 900)}`;
};

const OrderSchema = new Schema({
  // Order {_id}
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // city_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "City",
  //   required: true,
  // },
  total_price: { type: Number, required: true },
  order_status: {
    type: String,
    enum: ["processing", "shipped", "completed", "canceled"],
    default: "processing",
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },

  createdOn: { type: Date, default: new Date().getTime() },
  updated_at: { type: Date, default: new Date().getTime() },
  tracking_number: { type: String, default: generateTrackingNumber },
});

export const Order = model("Order", OrderSchema);
