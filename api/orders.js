import express from "express";
import { createOrder } from "./controllers/orderControllers.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/get-all-orders", getAllOrders);

export default router;
