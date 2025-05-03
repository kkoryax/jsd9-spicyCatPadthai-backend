import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { City } from "./City.js";



const UserSchema = new Schema({
  name: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date },
  address: { type: String },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  phoneNumber: { type: String },
  createdOn: { type: Date, default: new Date().getTime() },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model("User", UserSchema);