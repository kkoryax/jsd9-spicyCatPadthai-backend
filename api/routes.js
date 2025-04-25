import express from "express";
import userRoute from "../api/users.js"

const router = express.Router();

export default () => {
    router.use("/api", userRoute);

    return router;
}