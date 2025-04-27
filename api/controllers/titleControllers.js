import { Title } from "../../models/Title.js"

//GET all titles
export const getAllTitles = async(req, res) => {
    try {
        const title = await Title.find();
        res.json({
            error: false,
            title
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to fetch all titles",
            details: err.message
        })
    }
 }