import { Schema, model } from "mongoose";

const OrderDetailSchema = new Schema({
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

export const OrderDetail = model("OrderDetail", OrderDetailSchema);