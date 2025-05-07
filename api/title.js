import express from "express";
import { getAllTitles, createNewTitle, searchTitle, deleteTitle, getTitleById, updateTitle} from "./controllers/titleControllers.js";

const router = express.Router();

//GET all titles
router.get("/titles/get-all", getAllTitles);

//Create new title
router.post("/titles/create", createNewTitle);

//Search title
router.get("/titles/search", searchTitle);

//DELETE title
router.delete("/titles/:titleId", deleteTitle);

//Update title
router.put("/titles/:id", updateTitle);

router.get("/titles/:titleId", getTitleById)
export default router;