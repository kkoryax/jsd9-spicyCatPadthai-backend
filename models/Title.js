import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const TitleSchema = new Schema({
    name: {type: String},
    description: {type: String},
    /* picture: {type: String} */
});

export const Title = model("Title", TitleSchema);