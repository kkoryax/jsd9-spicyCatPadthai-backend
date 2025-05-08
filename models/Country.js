import { Schema, model } from "mongoose";

const CountrySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Country = model("Country", CountrySchema);