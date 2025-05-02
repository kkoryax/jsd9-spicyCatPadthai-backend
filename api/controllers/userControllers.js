import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../models/User.js";

//Get all users
export const getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.json({
            error: false,
            users
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to fetched all users",
            details: err.message
        });
    }
 };

//Register user
export const registerUser = async(req, res) => {
    const {
        email,
        password,
        name,
        lastName,
        dateOfBirth,
        address,
        city,
        country,
    } = req.body
    if(!email || !password || !name || !lastName || !dateOfBirth || !address || !city || !country || !phoneNumber) {
        return res.status(400).json({
            error: true,
            message: "All fields are required",
        });
    }
    try {
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(409).json({
                error: true,
                message: "Email already in use"
            });
        }
        const user = new User({
            email,
            password,
            name,
            lastName,
            dateOfBirth,
            address,
            city,
            country,
            phoneNumber
        });
        await user.save();

        res.status(201).json({
            error: false,
            message: "User registered successfully"
        })
    }
    catch (err) {
        res.status(500).json({
            error: true,
            message: "Server error",
            details: err.message
        })
    }
 };
