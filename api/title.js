import express from "express";
import { getAllTitles, createNewTitle, searchTitle, deleteTitle } from "./controllers/titleControllers.js";

const router = express.Router();

//GET all titles
router.get("/titles/get-all-titles", getAllTitles);

//Create new title
router.post("/titles/create-new-title", createNewTitle);

//Search title
router.get("/titles/search-title", searchTitle);

//DELETE title
router.delete("/titles/:id", deleteTitle);

export default router;