import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../models/User.js";


//Get all users controller
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


//Get user by Id Controller
export const GetUserById = async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to fetch user",
            details: err.message
        });
    }
}


//Register user controller
export const registerUser = async(req, res) => {
    const {
        email,
        password,
        name,
        lastName,
        dateOfBirth,
        address,
        city,
        phoneNumber,
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


//login controller
export const loginUser = async (req, res) => {
    const {email, password} = req.body
    if(!email||!password) {
        return res.status(400).json({
            error: true,
            message: "Email and password are required."
        })
    }


    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                error: true,
                message:"User not found",
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                error: true,
                message:"Wrong password",
            });
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: "1h",});


        res.json({
            error: false,
            token,
            message: "Login Successful"
        });


    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Server error",
            details: err.message,
        })
    }
}




//Update user controller
export const updateUser = async (req,res) => {
    try{
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }


        const updatedUser  = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
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


}


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
      // Assign the plain text new password. The pre('save') hook in User.js will handle hashing.
      user.password = newPassword;
      await user.save();
      console.log("New password saved:", user.password);
  
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


export const deleteUser = async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            });
        }
        res.status(200).json({
            error: false,
            message: "User deleted successfully",
            deletedUser: user
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to fetch user",
            details: err.message
        });
    }
}
