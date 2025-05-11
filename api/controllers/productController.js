import { Product } from "../../models/Product.js";
import { Types } from "mongoose";
import { trendingMangaTitles } from "../../util/trendingManga.js";

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

//GET New Release
export const getNewRelease = async(req, res) => {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - 14);

      const newReleaseTitles = await Product.aggregate([
        {
          $addFields: {
            parsedReleasedDate: { $toDate: "$releasedDate" }
          }
        },
        {
          $match: {
            parsedReleasedDate: { $gte: thresholdDate }
          }
        },
        {
          $sort: { parsedReleasedDate: -1 }
        },
        {
          $lookup: {
            from: "titles",
            localField: "title_id",
            foreignField: "_id",
            as: "titleDetails"
          }
        },
        {
          $unwind: {
            path: "$titleDetails",
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $group: {
            _id: "$titleDetails._id",
            title_name: { $first: "$titleDetails.title_name" },
            title_description: { $first: "$titleDetails.title_description" },
            title_picture: { $first: "$titleDetails.title_picture" },
            author_id: { $first: "$titleDetails.author_id" },
            latest_product_released_date: { $first: "$parsedReleasedDate" },
            latest_product_price: { $first: "$price" }
          }
        },
        {
          $sort: { latest_product_released_date: -1 }
        },
        {
          $limit: 12
        },
        {
          $lookup: {
            from: "authors",
            localField: "author_id",
            foreignField: "_id",
            as: "authorDetails"
          }
        },
        {
          $unwind: {
            path: "$authorDetails",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            title_name: 1,
            title_description: 1,
            title_picture: 1,
            price: "$latest_product_price",
            authorDetails: {
              _id: "$authorDetails._id",
              author_name: "$authorDetails.author_name"
            }
          }
        }
      ]);

      res.status(200).json({
        error: false,
        titles: newReleaseTitles,
        message: "New release titles retrieved successfully"
      });

    } catch (err) {
        console.error("Error in getNewRelease:", err);
        return res.status(500).json({
          error: true,
          message: "Internal Server Error",
          details: err.message
        });
    }
};

//GET trending manga
export const getTrendingManga = async (req, res) => {
  try {
    const trendingData = await Product.aggregate([
      {
        $match: {
          name_vol: { $in: trendingMangaTitles.map(name => new RegExp(name, "i")) },
        },
      },
      {
        $lookup: {
          from: "titles",
          localField: "title_id",
          foreignField: "_id",
          as: "titleDetails",
        },
      },
      {
        $unwind: {
          path: "$titleDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "titleDetails._id": { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: "$titleDetails._id",
          title_name: { $first: "$titleDetails.title_name" },
          title_picture: { $first: "$titleDetails.title_picture" },
          author_id: { $first: "$titleDetails.author_id" },
        }
      },
      {
        $limit: 12,
      },
      {
        $lookup: {
          from: "authors",
          localField: "author_id",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: "$_id",
          title_name: "$title_name",
          title_picture: "$title_picture",
          author_name: "$authorDetails.author_name",
        },
      },
    ]);

    res.status(200).json({
      error: false,
      trending: trendingData,
      message: "Trending manga loaded",
    });
  } catch (err) {
    console.error("Error in getTrendingManga:", err);
    res.status(500).json({
      error: true,
      message: "Internal server error",
      details: err.message,
    });
  }
};