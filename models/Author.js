import mongoose,{ Schema, model } from "mongoose";

const AuthorSchema = new Schema({
  author_name: { type: String, required: true },
    title_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Title",
    required: true,
  },
});

export const Author = model("Author", AuthorSchema);
