import express from "express";
import { getAllTitles } from "./controllers/titleControllers";

const router = express.Router();

//GET all titles
router.get("/titles", getAllTitles);

//Create new title
router.post("/titles")