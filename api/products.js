import express from "express";
import {
  getProductById,
  deleteProductById,
  updateProductById,
  createProduct,
  getAllProducts,
  getAllProductById,
  getNewRelease
} from "./controllers/productController.js";

const router = express.Router();

// GET all products
router.get("/products", getAllProducts);

//get NewRelease
router.get("/products/new-release", getNewRelease);

// GET product by id
router.get("/products/:_id", getProductById);

// Create a product
router.post("/products", createProduct);
// Update product
router.put("/products/:_id", updateProductById);
// Delete product
router.delete("/products/:_id", deleteProductById);

router.get("/productss/:title_id", getAllProductById);

export default router;
