import express from "express";

const router = express.Router();

export default() => {
    //Create GET
    router.get("/titles", (req, res) => {
        const {name, description, picture } = req.body
        try {

        } catch (error) {
            
        }
    })
    return router;
}