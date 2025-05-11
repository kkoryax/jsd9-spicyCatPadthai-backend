import { ProductCategory } from "../../models/ProductCategory.js";
import { Types } from "mongoose";

export const getCategoriesByTitleId = async (req, res) => {
  try {
    const { title_id } = req.params;
    if (!Types.ObjectId.isValid(title_id)) {
      return res.status(400).json({
        error: true,
        message: "Invalid product ID",
      });
    }
    const productCategories = await ProductCategory.find({
      title_id: new Types.ObjectId(title_id),
    }).populate("category_id");

    if (!productCategories || productCategories.length === 0) {
      // Check if the array is empty
      return res
        .status(404)
        .json({ message: "Categories with this ID not found" });
    }

    res.status(200).json({
      error: false,
      productCategories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching categories data" });
  }
};

export const createCategory = async (req, res) => {
  const { category_id, title_id } = req.body;

  if (!category_id || !title_id) {
    return res.status(400).json({
      error: true,
      message: "Both category_id and title_id are required",
    });
  }

  if (
    !Types.ObjectId.isValid(category_id) ||
    !Types.ObjectId.isValid(title_id)
  ) {
    return res.status(400).json({
      error: true,
      message: "Invalid category_id or title_id",
    });
  }
  try {
    const newCategory = new ProductCategory({
      category_id: new Types.ObjectId(category_id), // Ensure it's an ObjectId
      title_id: new Types.ObjectId(title_id), // Ensure it's an ObjectId
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      error: false,
      category: savedCategory,
      message: "Category created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating category",
      error: err,
    });
  }
};
