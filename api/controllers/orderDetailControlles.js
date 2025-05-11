import { OrderDetail } from "../../models/OrderDetail.js";

export const createOrderDetail = async (req, res) => {
  const { items } = req.body;
  try {
    const orderItems = items.map((item) => ({
      product_id:item.product_id,
      quantity:item.quantity,
      price:item.price,
    }));
    await OrderDetail.insertMany(orderItems);
    res.status(201).json({
      error: false,
      message: "Order detail created successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to create order detail",
      details: err.message,
    });
  }
};
