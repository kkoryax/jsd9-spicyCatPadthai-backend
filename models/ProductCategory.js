import mongoose, { Schema, model } from "mongoose";

const ProductCategorySchema = new Schema({
    category_id: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
    title_id: {type: mongoose.Schema.Types.ObjectId, ref: "Title", required: true},
});

export const ProductCategory = model("ProductCategory", ProductCategorySchema);