import express from "express";
import { getAllTitles, createNewTitle } from "./controllers/titleControllers.js";

const router = express.Router();

//GET all titles
router.get("/titles/get-all-titles", getAllTitles);

//Create new title
router.post("/titles/create-new-title", createNewTitle);

export default router;