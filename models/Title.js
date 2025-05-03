import mongoose, { Schema, model } from "mongoose";

const TitleSchema = new Schema({
    title_name: {type: String, required: true},
    title_description: {type: String, required: true},
    author_id: {type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true},
    // picture:{type:String},

});

export const Title = model("Title", TitleSchema);