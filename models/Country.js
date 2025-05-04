import 
import mongoose from "mongoose";
const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Country = mongoose.model("Country", countrySchema);
