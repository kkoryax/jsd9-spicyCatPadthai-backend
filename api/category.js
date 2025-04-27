import express from "express";
import { getAllCategory } from "./controllers/categoryControllers.js";

const router = express.Router();

//GET all category
router.get("/category/get-all", getAllCategory);

//Create new category
/* router.post("/category/create"); */

//Search category
/* router.get("/category/search"); */

//DELETE category
/* router.delete("/category/:id"); */

//Update category
/* router.put("/category/:id"); */

export default router;