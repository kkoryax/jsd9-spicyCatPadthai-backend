import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const TitleSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    /* author_id: {type: mongoose.Schema.Types.ObjectId, ref: "Author"}, */
    /* picture: {type: String} */
});

export const Title = model("Title", TitleSchema);