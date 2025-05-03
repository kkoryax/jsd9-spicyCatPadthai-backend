import { Schema, model } from "mongoose";

const AuthorSchema = new Schema({
  author_name: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});

export const Author = model("Author", AuthorSchema);
