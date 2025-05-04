import express from "express";
import { getAllUsers, GetUserById, registerUser, loginUser, updateUser, updateUserPassword, deleteUser, getAllCountries} from "./controllers/userControllers.js";


const router = express.Router();


//Get all users
router.get("/auth/get-all-users", getAllUsers);


//Get user by Id
router.get("/auth/user/:id", GetUserById);


//Register a user
router.post("/auth/register", registerUser);


//login
router.post("/auth/login", loginUser);


//Update user (some fields)
router.patch("/auth/user/:id", updateUser);


//Update user (All fields)
router.put("/auth/user/:id", updateUser);

// Update User Password
router.patch("/auth/user/:id/password", updateUserPassword);

//Delete User
router.delete("/auth/user/:id", deleteUser);

//Get country
router.get("/auth/country", getAllCountries);

export default router;
