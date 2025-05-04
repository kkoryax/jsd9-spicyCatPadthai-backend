import mongoose from "mongoose";
import { Schema, model } from "mongoose";


const CountrySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});


export const Country = mongoose.model("Country", CountrySchema);