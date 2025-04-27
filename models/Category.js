import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const CategorySchema = new Schema({
    name: {type: String, required: true},
});

export const Category = model("Category", CategorySchema);