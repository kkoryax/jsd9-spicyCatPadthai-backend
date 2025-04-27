import express from "express";
import userRoute from "../api/users.js";
import productRoute from "../api/products.js";
import authorRoute from "../api/author.js"

const router = express.Router();

export default () => {
  router.use("/api", userRoute);
  router.use("/", productRoute);
  router.use("/api", authorRoute);

  return router;
};
