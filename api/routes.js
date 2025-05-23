import express from "express";
import userRoute from "../api/users.js";
import productRoute from "../api/products.js";
import authorRoute from "../api/authors.js";
import titleRoute from "../api/title.js";
import categoryRoute from "../api/category.js";
import orderRoute from "../api/orders.js";
import pdcRoute from "../api/productCategory.js";
const router = express.Router();

export default () => {
  router.use("/api", userRoute);
  router.use("/api", titleRoute);
  router.use("/api", categoryRoute);
  router.use("/api", orderRoute);
  router.use("/", productRoute);
  router.use("/admin", authorRoute);
  router.use("/api", pdcRoute);

  return router;
};
