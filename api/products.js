import express from "express";
import {
  getProductById,
  deleteProductById,
  updateProductById,
  createProduct,
  getAllProducts,
} from "./controllers/productController.js";

const router = express.Router();

// GET all products
router.get("/products", getAllProducts);

// GET product by id
router.get("/products/:product_id", getProductById);

// Create a product
router.post("/products", createProduct);

// Update product
router.put("/products/:product_id", updateProductById);

// Delete product
router.delete("/products/:product_id", deleteProductById);

export default router;
