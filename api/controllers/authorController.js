import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Author } from "../../models/Author.js";

//Get all authors
export const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.json({
      error: false,
      authors,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetched all authors",
      details: err.message,
    });
  }
};

//Add author
export const addAuthor = async (req, res) => {
  const { author_name } = req.body;
  if (!author_name) {
    return res.status(400).json({
      error: true,
      message: "All fields are required",
    });
  }
  try {
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(409).json({
        error: true,
        message: "This author name already exists",
      });
    }
    await author_name.save();

    res.status(201).json({
      error: false,
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: err.message,
    });
  }
};

export const getAuthorById = async (req, res) => {
  const { _id } = req.params;
  try {
    const author = await Author.findOne({ _id });
    if (!_id) {
      return res.status(404).json({
        error: true,
        message: "Author not found!",
      });
    }
    res.json({
      error: false,
      author,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch the author",
      details: err.message,
    });
  }
};

export const updateAuthorById = async (req, res) => {
  const { _id } = req.params;
  const { author_name } = req.body;
  try {
    const author = await Author.updateOne({ _id }, { $set: { author_name } });
    if (author.matchedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Author not found!",
      });
    }
    res.json({
      error: false,
      author,
      message: "Author updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to update the author",
      details: err.message,
    });
  }
};

// Delete author by ID
export const deleteAuthorById = async (req, res) => {
  const { _id } = req.params;
  try {
    const author = await Author.findOne({ _id });
    if (!author) {
      return res.status(404).json({
        error: true,
        message: "Author not found!",
      });
    }
    await Author.deleteOne({ _id: author._id });
    res.json({
      error: false,
      message: "Author deleted successfully!",
      details: author,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to delete the author",
      details: err.message,
    });
  }
};
