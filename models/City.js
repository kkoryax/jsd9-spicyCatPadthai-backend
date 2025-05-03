const mongoose = require("mongoose");


// Schema สำหรับตาราง City
const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
});

// Model สำหรับตาราง City
export const City = mongoose.model("City", citySchema);

