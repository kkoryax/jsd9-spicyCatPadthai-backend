import { Order } from "../../models/Order.js";

export const createOrder = async (req, res) => {
  const { user_id, total_price, tracking_number } = req.body;
  try {
    const order = new Order({
      user_id,
      total_price,
      tracking_number,
    });
    await order.save();

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
export const purchase = async (req, res) => {
  const { order_id } = req.params;
  const { payment_status } = req.body;
  try {
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({
        error: true,
        message: "Order not found",
      });
    }

    res.json({
      error: false,
      order,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch order",
      details: err.message,
    });
  }
};
