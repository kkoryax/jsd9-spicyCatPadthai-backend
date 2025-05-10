import express from "express";
import { User } from "../models/User.js";
import { authUser } from "../middleware/auth.js";
import {
  getAllUsers,
  GetUserById,
  registerUser,
  loginUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getAllCountries,
  getAllCities,
  GetCityById,
} from "./controllers/userControllers.js";

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

//Get city
router.get("/auth/city", getAllCities);

//Get city by country id
router.get("/auth/country/:countryId/cities", GetCityById);

//GET Curresnt User profile
router.get("/auth/profile", authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    res.status(200).json({
      error: false,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: err.message,
    });
  }
});

// LOGOUT
router.post("/auth/logout", authUser, (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
