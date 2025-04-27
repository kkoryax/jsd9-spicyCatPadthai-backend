import express from "express";
import { getAllCategory, searchCategory } from "./controllers/categoryControllers.js";

const router = express.Router();

//GET all category
router.get("/category/get-all", getAllCategory);

//search category
router.get("/category/search", searchCategory);

//DELETE category
/* router.delete("/category/:id"); */

//Update category
/* router.put("/category/:id"); */

export default router;