import express from "express";
import { authUser } from "../middleware/auth.js";
import {
  createOrder,
  getAllOrders,
  updateOrder,
  getOrderById,
  getOrderByUserId,
  deleteOrderById,
  searchOrder,
} from "./controllers/orderControllers.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/get-all-orders", getAllOrders);
router.get("/get-order-by-orderid/:_id", getOrderById);
router.get("/get-order-by-userid/:user_id", getOrderByUserId);
router.patch("/update-order/:_id", updateOrder);
router.delete("/delete-order/:_id", deleteOrderById);
router.get("/search-order", authUser, searchOrder);

export default router;
