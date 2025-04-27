import { Order } from "../../models/Order.js";
import { OrderDetail } from "../../models/OrderDetail.js";
import { Payment } from "../../models/Payment.js";

export const createOrder = async (req, res) => {
  const {
    total_price,
    tracking_number,
    shipping_address,
    order_status,
    quantity, 
    price, 
    amount, 
    payment_method,
    payment_status,
    payment_date,
  } = req.body;
  try {
    const order = new Order({
      total_price,
      tracking_number,
      shipping_address,
      order_status,
    });
    await order.save();

    const orderDetail = new OrderDetail({
      order_id: order._id,
      quantity,
      price,
    });
    await orderDetail.save();

    const payment = new Payment({
      order_id: order._id,
      amount,
      payment_method,
      payment_status,
      payment_date,
    });
    await payment.save();
    
    res.status(201).json({
      error: false,
      message: "Order created successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to create order",
      details: err.message,
    });
  }
};
