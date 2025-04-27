import express from "express";
import { getAllTitles, createNewTitle, searchTitle, deleteTitle } from "./controllers/titleControllers.js";

const router = express.Router();

//GET all titles
router.get("/titles/get-all", getAllTitles);

//Create new title
router.post("/titles/create", createNewTitle);

//Search title
router.get("/titles/search", searchTitle);

//DELETE title
router.delete("/titles/:id", deleteTitle);

//Update title
// router.put("/titles/:id");

export default router;