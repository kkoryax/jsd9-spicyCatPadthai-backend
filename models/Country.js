import mongoose from "mongoose";
// Schema สำหรับตาราง Country
const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Model สำหรับตาราง Country
export const Country = mongoose.model("Country", countrySchema);
