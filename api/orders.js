import express from "express";
import { createOrder, getAllOrders, updateOrder} from "./controllers/orderControllers.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/get-all-orders", getAllOrders);
router.put("/update-order", updateOrder);

export default router;
