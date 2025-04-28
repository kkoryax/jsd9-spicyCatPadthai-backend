import { Schema, model } from "mongoose";

const TitleSchema = new Schema({
    title_name: {type: String, required: true},
    description: {type: String, required: true},
    /* author_id: {type: String, required: true}, */
    /* picture: {type: String} */
});

export const Title = model("Title", TitleSchema);