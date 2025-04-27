import express from "express";
import { getAllAuthors, addAuthor, updateAuthorById, deleteAuthorById, getAuthorById } from "./controllers/authorController";

const router = express.Router();

// GET all products
router.get("/authors", getAllAuthors);

// GET product by id
router.get("/authors/:_id", getAuthorById);

// Create a product
router.post("/authors", addAuthor);

// Update product
router.put("/authors/:_id", updateAuthorById);

// Delete product
router.delete("/authors/:_id", deleteAuthorById );

export default router;
