import { Types } from "mongoose";
import { Title } from "../../models/Title.js";

//GET all titles
export const getAllTitles = async (req, res) => {
  try {
    const titles = await Title.aggregate([
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
          _id: 1,
          title_name: 1,
          title_description: 1,
          title_picture: 1,
          author_id: {
            _id: "$authorDetails._id",
            author_name: "$authorDetails.author_name",
          },
        },
      },
    ]);
    res.json({
      error: false,
      title: titles,
      message: "Get all titles successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch all titles",
      details: err.message,
    });
  }
};

//GET title by search query (title, description, author)
export const searchTitle = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            error: true,
            message: "Search query is required"
        });
    }

    try {
        const regexQuery = new RegExp(query, "i");
        const matchingTitle = await Title.aggregate([
            {
                $lookup: {
                    from: "authors",
                    localField: "author_id",
                    foreignField: "_id",
                    as: "authorInfo"
                }
            },
            {
                $unwind: {
                    path: "$authorInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "productcategories",
                    localField: "_id",
                    foreignField: "title_id",
                    as: "titleCategoryLinks"
                }
            },
            {
                $unwind: {
                    path: "$titleCategoryLinks",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "titleCategoryLinks.category_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: {
                    path: "$categoryDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: [
                        { title_name: { $regex: regexQuery } },
                        { title_description: { $regex: regexQuery } },
                        { "authorInfo.author_name": { $regex: regexQuery } },
                        { "categoryDetails.category_name": { $regex: regexQuery } }
                    ]
                }
            },
            {
                $group: {
                    _id: "$_id",
                    title_name: { $first: "$title_name" },
                    title_description: { $first: "$title_description" },
                    title_picture: { $first: "$title_picture" },
                    author_id: { $first: "$author_id" },
                    authorInfo: { $first: "$authorInfo" }
                }
            }
        ]);

        res.json({
            error: false,
            title: matchingTitle,
            message: "Matching titles (by title, description, author, or category) retrieved successfully"
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};

//CREATE new title
export const createNewTitle = async (req, res) => {
  const { title_name, title_description, author_id } = req.body;
  if (!title_name) {
    return res.status(400).json({
      error: true,
      message: "Title names are required",
    });
  }
  if (!title_description) {
    return res.status(400).json({
      error: true,
      message: "Description names are required",
    });
  }
  if (!author_id) {
    return res.status(400).json({
      error: true,
      message: "Author ID are required",
    });
  }
  try {
    const title = new Title({
      title_name,
      title_description,
      author_id,
    });
    await title.save();

    res.status(201).json({
      error: false,
      message: "Title created successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: false,
      message: "Server error",
    });
  }
};

//Update title by ID
export const updateTitle = async (req, res) => {
  const { titleId } = req.params;
  const { title_name, title_description, author_id } = req.body;

  try {
    const title = await Title.findOneAndUpdate(
      { _id: titleId },
      { $set: { title_name, title_description, author_id } }
    );
    if (!title) {
      return res.status(404).json({
        error: true,
        message: "Title not found",
      });
    }
    res.status(200).json({
      error: false,
      message: "Title updated successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

//DELETE title
export const deleteTitle = async (req, res) => {
  const { titleId } = req.params;
  try {
    const deleteTitle = await Title.findByIdAndDelete(titleId);
    if (!deleteTitle) {
      return res.status(404).json({
        message: "Title not found",
      });
    }
    res.json({
      message: "Title deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: err.message,
    });
  }
};

//Get TitleById
export const getTitleById = async (req, res) => {
  try {
    const { titleId } = req.params;

    const title = await Title.findOne({ _id: new Types.ObjectId(titleId) });

    if (!title) {
      return res.status(404).json({ message: "Title with this ID not found" });
    }

    res.status(200).json(title);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching Title data" });
  }
};
