import { Types } from "mongoose";
import { Title } from "../../models/Title.js"

//GET all titles
export const getAllTitles = async(req, res) => {
    try {
        const title = await Title.find().populate('author_id');
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
                {title_name: {$regex: new RegExp(query, "i")}}
            ]
        });
        res.json({
            error: false,
            title_name: matchingTitle,
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
    const { title_name, description, author_id } = req.body
    if(!title_name || !description || !author_id) {
        return res.status(400).json({
            error: true,
            message: "All fields are required"
        });
    }
    try {
        const title = new Title ({
            title_name,
            description,
            author_id
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
    const { titleId } = req.params
    try {
        const deleteTitle = await Title.findByIdAndDelete(titleId);
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
export const getTitleById = async (req, res) => {
  try {
    const { titleId } = req.params;

    const title = await Title.findOne({ _id: new Types.ObjectId(titleId) });

    if (!title) {
      return res.status(404).json({ message: 'Title with this ID not found' });
    }

    res.status(200).json(title);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching Title data' });
  }
};