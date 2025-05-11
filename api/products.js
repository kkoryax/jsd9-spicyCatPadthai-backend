import express from "express";
import {
  getProductById,
  deleteProductById,
  updateProductById,
  createProduct,
  getAllProducts,
  getAllProductById,
  getSimilarProducts,
  getNewRelease,
  getTrendingManga,
} from "./controllers/productController.js";

const router = express.Router();

// GET all products
router.get("/products", getAllProducts);

//GET New Release
router.get("/products/new-release", getNewRelease);

//GET Trending Manga
router.get("/products/trending-book", getTrendingManga);

// GET product by id
router.get("/products/:_id", getProductById);

// Create a product
router.post("/products", createProduct);
// Update product
router.put("/products/:_id", updateProductById);
// Delete product
router.delete("/products/:_id", deleteProductById);

router.get("/productss/:title_id", getAllProductById);

router.get("/products/get-similar/:titleId", getSimilarProducts);

export default router;
