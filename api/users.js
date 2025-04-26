import express from "express";
import { getAllUsers, GetUserById, registerUser, loginUser, updateUser, deleteUser} from "./controllers/userControllers.js";


const router = express.Router();


//Get all users
router.get("/auth/get-all-users", getAllUsers);


//Get user by Id
router.post("/auth/user/:id", GetUserById);


//Register a user
router.post("/auth/register", registerUser);


//login
router.post("/auth/login", loginUser);


//Update user (some fields)
router.patch("/auth/user/:id", updateUser);


//Update user (All fields)
router.put("/auth/user/:id", updateUser);


//Delete User
router.delete("/auth/user/:id", deleteUser);


export default router;
