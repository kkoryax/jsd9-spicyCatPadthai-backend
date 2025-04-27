import express from "express";
import userRoute from "../api/users.js"
import titleRoute from "../api/title.js"

const router = express.Router();

export default () => {
    router.use("/api", userRoute);
    router.use("/api", titleRoute);

    return router;
}