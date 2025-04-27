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

//GET title by search query
export const searchTitle = async(req, res) => {
    const { query } = req.query
    if (!query) {
        res.status(400).json({
            error: true,
            message: "Search query is required"
        });
    }
    try {
        const matchingTitle = await Title.find({
            $or: [
                {name: {$regex: new RegExp(query, "i")}}
            ]
        });
        res.json({
            error: false,
            titles: matchingTitle,
            message: "Matching title via search query retrieve successful"
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Internal Server Error"
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

//Update title
export const updateTitle = async(req, res) => {
    try {

    } catch (err) {

    }
}

//DELETE title
export const deleteTitle = async(req, res) => {
    const { _id } = req.body
    try {
        const deleteTitle = await Title.findByIdAndDeletefindOneAndDelete(_id);
        if (!deleteTitle) {
            return res.status(404).json({
                message: "Title not found"
            });
        }
        res.json({
            message: "Title deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            details: err.message
        });
    }
};