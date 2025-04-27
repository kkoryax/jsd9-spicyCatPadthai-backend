import { Product } from "../../models/Product.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      error: false,
      products,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch all products",
      details: err.message,
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { product_id } = req.params;
  try {
    const product = await Product.findOne({ product_id });
    if (!product_id) {
      return res.status(404).json({
        error: true,
        message: "Product not found!",
      });
    }
    res.json({
      error: false,
      product,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch the product",
      details: err.message,
    });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  const { product_id, name_vol, volume_no, description, price } = req.body;
  try {
    const product = await Product.create({
      product_id,
      name_vol,
      volume_no,
      description,
      price,
    });
    res.json({
      error: false,
      product,
      message: "Product created successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to create the product",
      details: err.message,
    });
  }
};

// Update a product by ID
export const updateProductById = async (req, res) => {
  const { product_id } = req.params;
  const { name_vol, volume_no, description, price, quantity } = req.body;
  try {
    const product = await Product.updateOne(
      { product_id },
      { $set: { name_vol, volume_no, description, price, quantity } }
    );
    if (product.matchedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Product not found!",
      });
    }
    res.json({
      error: false,
      product,
      message: "Product updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to update the product",
      details: err.message,
    });
  }
};

// Delete a product by ID
export const deleteProductById = async (req, res) => {
  const { product_id } = req.params;
  try {
    const product = await Product.findOne({ product_id });
    if (!product) {
      return res.status(404).json({
        error: true,
        message: "Product not found!",
      });
    }
    await Product.deleteOne({ _id: product._id });
    res.json({
      error: false,
      message: "Product deleted successfully!",
      details: product,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to delete the product",
      details: err.message,
    });
  }
};
