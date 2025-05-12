import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRoute from "./api/routes.js";
import limiter from "./middleware/limiter.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jsd9-spicy-cat-pad-thai-frontend.vercel.app",
    ],
    credentials: true,
  })
);

//Add limiter to protect server from spam requests
app.use(limiter);
//CREATE Middleware to parse JSON to JavaScript Object
app.use(express.json());

//CONNECT to MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connecting to MongoDB successfully ✅`);
  } catch (err) {
    console.error(`Database Connection failed: ${err}`);
    process.exit(1);
  }
})();

app.use("/", apiRoute());

app.listen(PORT, () => {
  console.log(`Server now running on http://localhost:${PORT}`);
});
