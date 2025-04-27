import express from "express";
import userRoute from "../api/users.js";
import productRoute from "../api/products.js";

const router = express.Router();

export default () => {
  router.use("/api", userRoute);
  router.use("/api", productRoute);

  return router;
};
