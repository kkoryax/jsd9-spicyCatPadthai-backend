import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const AuthorSchema = new Schema({
  author_name: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});

export const Author = model("Author", AuthorSchema);
