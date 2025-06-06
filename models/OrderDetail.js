import mongoose, { Schema, model } from "mongoose";

const OrderDetailSchema = new Schema({
    // OrderDetail{_id}
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  subtotal_price: { type: Number, required: true }, // Price per unit at the time of order
});

export const OrderDetail = model("OrderDetail", OrderDetailSchema);