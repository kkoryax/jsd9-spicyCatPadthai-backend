import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const CitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
});


export const City = model("City", CitySchema);
