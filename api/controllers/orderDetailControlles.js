import {orderDetail} from "../../models/OrderDetail.js";

export const createOrderDetail = async(req, res) => {
    const {quantity, price} = req.body
    try {
        const orderDetail = new OrderDetail({
            quantity,
            price
        })
        await orderDetail.save();
        res.status(201).json({
            error: false,
            message: "Order detail created successfully",
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to create order detail",
            details: err.message
        });
    }
}