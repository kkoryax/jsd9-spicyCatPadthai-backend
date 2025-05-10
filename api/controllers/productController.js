import { Product } from "../../models/Product.js";
import { Types } from "mongoose";

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
  const { _id } = req.params;
  try {
    const product = await Product.findOne({ _id });
    if (!_id) {
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
  const { name_vol, volume_no, description, price, title_id, author_id, quantity} = req.body;
  try {
    const product = await Product.create({
      name_vol,
      volume_no,
      description,
      price,
      author_id,
      title_id,
      quantity,
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
  const { _id } = req.params;
  const { name_vol, volume_no, description, price, quantity } = req.body;
  try {
    const product = await Product.updateOne(
      { _id },
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
  const { _id } = req.params;
  try {
    const product = await Product.findOne({ _id });
    if (!product) {
      return res.status(404).json({
        error: true,
        message: "Product not found!",
      });
    }
    await Product.deleteOne({ _id });
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
// Get product by ID
export const getAllProductById = async (req, res) => {
  const {title_id } = req.params;
  if (!Types.ObjectId.isValid(title_id)) {
    return res.status(400).json({
      error: true,
      message: "Invalid product ID",
    });
  }
  try {
    const product = await Product.find({title_id:new Types.ObjectId(title_id)});
    if (!title_id) {
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


export const getNewRelease = async(req, res) => {
    try {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const newRelease = await Product.find(
        { releaseDate: { $gte: twoWeeksAgo } }, //No releaseDate in Schema rightnow
        { title: 1, releaseDate: 1 }
      )
      .sort({ releaseDate: -1 })
      .limit(12);

    } catch (err) {
        return res.status(500).json({
          error: true,
          message: "Internal Server Error",
          details: err.message
        })
    }
}