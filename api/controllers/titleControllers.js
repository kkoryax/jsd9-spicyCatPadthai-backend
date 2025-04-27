import { Title } from "../../models/Title.js"

//GET all titles
export const getAllTitles = async(req, res) => {
    try {
        const title = await Title.find();
        res.json({
            error: false,
            title
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to fetch all titles",
            details: err.message
        });
    }
};

 //CREATE new title
 export const createNewTitle = async(req, res) => {
    const { name, description } = req.body
    if(!name || !description) {
        return res.status(400).json({
            error: true,
            message: "All fields are required"
        });
    }
    try {
        const title = new Title ({
            name,
            description
        });
        await title.save();

        res.status(201).json({
            error: false,
            message: "Title created successfully"
        })
    } catch (err) {
        res.status(500).json({
            error: false,
            message: "Server error"
        });
    }
};