import { Schema, model } from "mongoose";


const CategorySchema = new Schema({
    category_name: {type: String, required: true},
});

export const Category = model("Category", CategorySchema);