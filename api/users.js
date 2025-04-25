import express from "express";
import { getAllUsers, registerUser } from "./controllers/userControllers.js";

const router = express.Router();

//Get all users
router.get("/auth/get-all-users", getAllUsers);

//Register a user
router.post("/auth/register", registerUser);

export default router;