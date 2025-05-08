import { Category } from "../../models/Category.js"

//GET all category
export const getAllCategory = async(req, res) => {
    try {
        const category = await Category.find();
        res.json({
            error: false,
            category
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to fetch all category",
            details: err.message
        });
    }
};

//GET title by search query
export const searchCategory = async(req, res) => {
    const { query } = req.query
    if (!query) {
        res.status(400).json({
            error: true,
            message: "Search query is required"
        });
    }
    try {
        const matchingCategory = await Category.find({
            $or: [
                {category_name: {$regex: new RegExp(query, "i")}}
            ]
        });
        res.json({
            error: false,
            Category: matchingCategory,
            message: "Matching category via search query retrieve successful"
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};

//CREATE category
 export const createCategory = async(req, res) => {
    const { category_name } = req.body
    if(!category_name) {
        return res.status(400).json({
            error: true,
            message: "All fields are required"
        });
    }
    try {
        const existingCategory = await Category.findOne({category_name})
        if (existingCategory) {
            return res.status(409).json({
                error: true,
                message: "Already have this category"
            });
        }
        const category = new Category ({
            category_name
        });
        await category.save();

        res.status(201).json({
            error: false,
            message: "Category created successfully"
        })
    } catch (err) {
        res.status(500).json({
            error: false,
            message: "Server error"
        });
    }
};

export const deleteCategory = async(req, res) => {
    const { categoryId } = req.params

    try {
        const deleteCategory = await Category.findByIdAndDelete(categoryId);
        if(!deleteCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        res.json({
            message: "Category deleted successfully"
        });
    } catch(err) {
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            details: err.message
        });
    }
};

export const getCategoryById = async(req, res) => {
    const { categoryId } = req.params

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        return res.status(200).json({
            error: false,
            category,
            message: "Category retreive successfully!"
        })
    } catch (err) {
        return res.json({
            error: true,
            message: "Internal Server Error",
            details: err.message
        });
    }
};