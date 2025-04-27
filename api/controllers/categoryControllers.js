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