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
                {name: {$regex: new RegExp(query, "i")}}
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
    const { name } = req.body
    if(!name) {
        return res.status(400).json({
            error: true,
            message: "All fields are required"
        });
    }
    try {
        const existingCategory = await Category.findOne({name})
        if (existingCategory) {
            return res.status(409).json({
                error: true,
                message: "Already have this category"
            });
        }
        const category = new Category ({
            name
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
