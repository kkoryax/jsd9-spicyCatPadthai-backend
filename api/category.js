import express from "express";
import { getAllCategory, searchCategory, createCategory, deleteCategory, getCategoryById } from "./controllers/categoryControllers.js";

const router = express.Router();

//GET all category
router.get("/category/get-all", getAllCategory);

//search category
router.get("/category/search", searchCategory);

//CREATE category
router.post("/category/create", createCategory);

//DELETE category
router.delete("/category/:categoryId", deleteCategory);

//Get Category by Id
router.get("/category/:categoryId", getCategoryById)

//Update category
/* router.put("/category/:id"); */

export default router;