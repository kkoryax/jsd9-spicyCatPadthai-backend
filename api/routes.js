import express from "express";
import userRoute from "../api/users.js"
import orderRoute from "../api/orders.js"

const router = express.Router();

export default () => {
    router.use("/api", userRoute);
    router.use("/api", orderRoute);

    return router;
}