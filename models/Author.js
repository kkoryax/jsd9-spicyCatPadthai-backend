import mongoose,{ Schema, model } from "mongoose";

const AuthorSchema = new Schema({
  author_name: { type: String, required: true },

});

export const Author = model("Author", AuthorSchema);
