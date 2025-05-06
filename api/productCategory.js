import express from "express";
import {createCategory, getCategoriesByTitleId} from "./controllers/productCategoryController.js"

const router = express.Router();

router.get("/pdc/:title_id", getCategoriesByTitleId)
router.post("/pdc", createCategory)
export default router;