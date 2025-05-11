import { Order } from "../../models/Order.js";
import { OrderDetail } from "../../models/OrderDetail.js";
import { User } from "../../models/User.js";
import { Title } from "../../models/Title.js";
import { Author } from "../../models/Author.js";
import mongoose from "mongoose";
import { Payment } from "../../models/Payment.js";

export const createOrder = async (req, res) => {
  const { user_id, tracking_number, order_status, total_price, items } =
    req.body;

  try {
    const order = new Order({
      user_id,
      total_price,
      tracking_number,
      order_status,
    });
    await order.save();

    const orderItems = [];
    for (const item of items) {
      const orderItem = {
        order_id: order._id,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal_price: item.subtotal_price,
      };
      orderItems.push(orderItem);
    }
    await OrderDetail.insertMany(orderItems);

    res.status(201).json({
      error: false,
      message: "Order created successfully",
      order,
      orderItems,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to create order",
      details: err.message,
    });
  }
};
export const getOrderById = async (req, res) => {
  const { _id } = req.params;

  try {
    const order = await Order.findById({ _id });
    if (!order) {
      return res.status(404).json({
        error: true,
        message: "Order not found",
      });
    }
    const userDetails = await User.findById(order.user_id)
      .select("name lastName address city_id country_id phoneNumber")
      .populate({
        path: "city_id",
        select: "name country_id",
        populate: {
          path: "country_id",
          select: "name",
        },
      });

    // Fetch order details based on the current order's _id
    const orderDetails = await OrderDetail.find({
      order_id: order._id, // Corrected from orders.map() to order._id
    })
      .populate("order_id")
      .populate({
        path: "product_id",
        populate: [
          { path: "title_id", model: "Title" },
          { path: "author_id", model: "Author" },
        ],
      });

    res.json({
      error: false,
      userDetails,
      order,
      orderDetails,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch order",
      details: err.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({
      error: false,
      orders,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetched all orders",
      details: err.message,
    });
  }
};

export const getOrderByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    const orders = await Order.find({ user_id }).populate("user_id");

    const orderDetails = await OrderDetail.find({
      order_id: { $in: orders.map((order) => order._id) },
    })
      .populate("order_id")
      .populate({
        path: "product_id",
        populate: [
          { path: "title_id", model: "Title" },
          { path: "author_id", model: "Author" },
        ],
      });

    res.json({
      error: false,
      user,
      orders,
      orderDetails,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch order using user id",
      details: err.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  const { _id } = req.params;
  const {
    user_id,
    tracking_number,
    order_status,
    payment_method,
    payment_status,
    OrderDetail: order_detail,
  } = req.body;

  try {
    const order = await Order.findById(_id);
    if (!order) {
      return res.status(404).json({
        error: true,
        message: "Order not found",
      });
    }

    // Update the order fields
    order.user_id = user_id || order.user_id;
    order.tracking_number = tracking_number || order.tracking_number;
    order.order_status = order_status || order.order_status;
    order.payment_method = payment_method || order.payment_method;

    // Update total price calculation
    if (order_detail) {
      order.total_price = order_detail.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    await order.save();

    // Update OrderDetail records
    const orderDetails = [];
    if (order_detail) {
      await OrderDetail.deleteMany({ order_id: order._id });
      for (const detail of order_detail) {
        const orderDetail = new OrderDetail({
          order_id: order._id,
          product_id: detail.product_id,
          quantity: detail.quantity,
          price: detail.price,
        });
        await orderDetail.save();
        orderDetails.push(orderDetail);
      }
    }

    // Update Payment record
    // const payment = await Payment.findOne({ order_id: order._id });
    // if (payment) {
    //   payment.amount = order.total_price;
    //   payment.payment_method = payment_method || payment.payment_method;
    //   payment.payment_status = payment_status || payment.payment_status;
    //   payment.payment_date = new Date();
    //   await payment.save();
    // }

    res.status(200).json({
      error: false,
      message: "Order updated successfully",
      order,
      orderDetails,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to update order",
      details: err.message,
    });
  }
};

export const deleteOrderById = async (req, res) => {
  const { _id } = req.params;
  try {
    const order = await Order.findOne({ _id });
    if (!order) {
      return res.status(404).json({
        error: true,
        message: "Order not found!",
      });
    }
    await Order.deleteOne({ _id });
    res.json({
      error: false,
      message: "Order deleted successfully!",
      details: order,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to delete the order",
      details: err.message,
    });
  }
};

export const searchOrder = async (req, res) => {
  try {
    const user = req.user;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        error: true,
        message: "Search query is required",
      });
    }

    if (!user?.user?._id) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized: No user found",
      });
    }

    const searchResults = await OrderDetail.aggregate([
      // Join Orders
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },

      // Filter orders for this user
      {
        $match: { "order.user_id": new mongoose.Types.ObjectId(user.user._id) },
      },

      // Join Products
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // Join Titles
      {
        $lookup: {
          from: "titles",
          localField: "product.title_id",
          foreignField: "_id",
          as: "title",
        },
      },
      { $unwind: { path: "$title" } },

      // Join Authors
      {
        $lookup: {
          from: "authors",
          localField: "product.author_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: { path: "$author" } },
      {
        $addFields: {
          "order.id_string": { $toString: "$order._id" },
        },
      },

      // Apply filtering conditions for title, author, order status, tracking number, and product volume
      {
        $match: {
          $or: [
            { "title.title_name": { $regex: query, $options: "i" } },
            { "author.author_name": { $regex: query, $options: "i" } },
            { "product.name_vol": { $regex: query, $options: "i" } },
            { "order.order_status": { $regex: query, $options: "i" } },
            { "order.tracking_number": { $regex: query, $options: "i" } },
            { "order.id_string": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $group: {
          _id: "$order_id", // group by order ID
          order_status: { $first: "$order.order_status" },
          tracking_number: { $first: "$order.tracking_number" },
          createdOn: { $first: "$order.createdOn" },
          total_price: { $first: "$order.total_price" },
          product_id: { $first: "$product._id" },
          title_name: { $first: "$title.title_name" },
          author_name: { $first: "$author.author_name" },
          name_vol: { $first: "$product.name_vol" },
        },
      },
      {
        $project: {
          _id: 0,
          order_id: "$_id",
          order_status: 1,
          tracking_number: 1,
          createdOn: 1,
          total_price: 1,
          product_id: 1,
          title_name: 1,
          author_name: 1,
          name_vol: 1,
        },
      },
    ]);

    return res.json({
      error: false,
      searchResults,
      message:
        "Orders matching title, author, or other details retrieved successfully",
    });
  } catch (error) {
    console.error("Error in searchOrder aggregation:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};
