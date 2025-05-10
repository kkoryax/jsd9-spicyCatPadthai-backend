import { Title } from "../../models/Title.js";
import { Types } from "mongoose";
import { ProductCategory } from "../../models/ProductCategory.js";
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
  const {
    name_vol,
    volume_no,
    description,
    price,
    title_id,
    author_id,
    quantity,
  } = req.body;
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
  const { title_id } = req.params;
  if (!Types.ObjectId.isValid(title_id)) {
    return res.status(400).json({
      error: true,
      message: "Invalid product ID",
    });
  }
  try {
    const product = await Product.find({
      title_id: new Types.ObjectId(title_id),
    }).sort({ volume_no: -1 });
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

export const getNewRelease = async (req, res) => {
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
      details: err.message,
    });
  }
};

// Get similar products based on shared categories
export const getSimilarProducts = async (req, res) => {
  const { titleId } = req.params;
  // Validate titleId format
  if (!titleId || !Types.ObjectId.isValid(titleId)) {
    return res.status(400).json({
      error: true,
      message: "Invalid titleId format.",
      similar_books: [],
    });
  }

  try {
    // 1. Get category IDs for the original title
    const originalTitleObjectId = new Types.ObjectId(titleId);
    const categoriesOfOriginalTitle = await ProductCategory.find({
      title_id: originalTitleObjectId, // Use ObjectId for querying
    }).select("category_id");

    const categoryIds = categoriesOfOriginalTitle.map((pc) => pc.category_id);

    if (categoryIds.length === 0) {
      return res.json({ error: false, similar_books: [] });
    }

    // 2. Find all title_ids that share any of these categories.
    const similarTitleIds = await ProductCategory.find({
      category_id: { $in: categoryIds },
    }).distinct("title_id"); // Returns an array of title_id values

    if (similarTitleIds.length === 0) {
      return res.json({ error: false, similar_books: [] });
    }

    // 3. Fetch products from these similar titles.
    // The _id: { $ne: originalTitleObjectId } condition compares Product._id with the original Title's ID.
    // This is unlikely to be the cause of zero results but isn't precisely "excluding the original product viewed".
    const similarProducts = await Product.aggregate([
      {
        $match: {
          title_id: { $in: similarTitleIds }, // Products from titles sharing categories
          _id: { $ne: originalTitleObjectId }, // Compare Product._id with original Title's ID
        },
      },
      { $sample: { size: 4 } }, // Randomly pick up to 4 products
      {
        // Lookup for Title details (name, image)
        $lookup: {
          from: "titles", // collection name for Title model
          localField: "title_id",
          foreignField: "_id",
          as: "titleDetails",
        },
      },
      {
        $unwind: { path: "$titleDetails", preserveNullAndEmptyArrays: true },
      },
      {
        // Lookup for Author details
        $lookup: {
          from: "authors", // collection name for Author model
          localField: "author_id", // Product model has author_id
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: { path: "$authorDetails", preserveNullAndEmptyArrays: true },
      },
      {
        // Project to shape the output as expected by frontend
        $project: {
          _id: 0,
          product_id: "$_id",
          name: "$name_vol", // Product's volume name
          volume: "$volume_no", // Product's volume number
          price: "$price",
          img: "$picture",
          title: "$titleDetails.title_name", // Title's main name

          author: "$authorDetails.author_name",
        },
      },
    ]);

    res.json({ error: false, similar_books: similarProducts });
  } catch (err) {
    console.error("Error in getSimilarProducts:", err);
    res.status(500).json({
      error: true,
      message: "Failed to fetch similar products",
      details: err.message,
    });
  }
};
