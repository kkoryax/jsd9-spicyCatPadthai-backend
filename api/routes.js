import express from "express";
import userRoutes from "./users.js";
import productRoutes from "./products.js";
import titleRoutes from "./title.js";
import orderRoutes from "./order.js";

const router = express.Router();

export default (db) => {
    router.use(userRoutes(db));
    router.use(productRoutes(db));
    router.use(titleRoutes(db));
    router.use(orderRoutes(db));

    return router;
}