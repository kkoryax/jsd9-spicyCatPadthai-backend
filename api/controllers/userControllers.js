import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../models/User.js";
import { Country } from "../../models/Country.js";
import { City } from "../../models/City.js";

//Get all users controller
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate({
        path: "city_id",
        populate: {
          path: "country_id", // ชื่อ Field ใน Schema ของ City ที่อ้างอิงไปยัง Country
          model: "Country", // ชื่อ Model ของ Country (ตรวจสอบให้ถูกต้องตามที่คุณตั้งไว้)
        },
      })
      res.json(users);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetched all users",
      details: err.message,
    });
  }
};

//Get user by Id Controller
export const GetUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "city_id",
      populate: {
        path: "country_id",
        model: "Country",
      },
    });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch user",
      details: err.message,
    });
  }
};

//Register user controller
export const registerUser = async (req, res) => {
  const {
    email,
    password,
    name,
    lastName,
    dateOfBirth,
    address,
    city_id,
    phoneNumber,
  } = req.body;
  if (
    !email ||
    !password ||
    !name ||
    !lastName ||
    !dateOfBirth ||
    !address ||
    !city_id ||
    !phoneNumber
  ) {
    return res.status(400).json({
      error: true,
      message: "All fields are required",
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: "Email already in use",
      });
    }

    // const city = await City.findOne({ name: cityName });
    // if (!city) {
    //   return res.status(400).json({
    //     error: true,
    //     message: "City not found. Please resigter with a valid city name.",
    //   });
    // }

    const user = new User({
      email,
      password,
      name,
      lastName,
      dateOfBirth,
      address,
      city_id,
      phoneNumber,
    });
    await user.save();

    res.status(201).json({
      error: false,
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: err.message,
    });
  }
};

//login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and password are required.",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: "Wrong password",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd, // only send over HTTPS in prod
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({
      error: false,
      token,
      message: "Login Successful",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: err.message,
    });
  }
};

//Update user controller
export const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }


    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    res.status(200).json({
      error: false,
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to update user",
      details: err.message,
    });
  }
};

// Update User Password Controller
export const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: true,
      message: "Both current and new passwords are required",
    });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: "Incorrect current password",
      });
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      error: false,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to update password",
      details: err.message,
    });
  }
};

// Delete a user Controller

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    res.status(200).json({
      error: false,
      message: "User deleted successfully",
      deletedUser: user,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch user",
      details: err.message,
    });
  }
};

// get all country controller

export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find(); 
    res.json(countries);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch countries",
      details: err.message,
    });
  }
};


// get all city controller

export const getAllCities = async (req, res) => {
    try {
      const cities = await City.find(); 
      res.json(cities);
    } catch (err) {
      res.status(500).json({
        error: true,
        message: "Failed to fetch countries",
        details: err.message,
      });
    }
  };


//Get city by country Id Controller
export const GetCityById = async (req, res) => {
  try {
    const { countryId } = req.params;
    if (!countryId) {
      return res.status(400).json({
        error: true,
        message: "Country ID is required",
      });
    }

    const city = await City.find({ country_id: countryId });
    if (!city) {
      return res.status(404).json({
        error: true,
        message: "city not found",
      });
    }
    res.json(city);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch city",
      details: err.message,
    });
  }
};