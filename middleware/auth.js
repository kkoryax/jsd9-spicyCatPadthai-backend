import jwt from "jsonwebtoken"

export const authUser = async(req, res, next) => {
    const token = req.cookies?.token
    if(!token) {
        return res.json({
            success: false,
            message: "Access denied, Token not found."
        });
    }
    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {user: {_id: decoded_token.userId}}
        next();
    }
    catch (err) {
        const isExpired = err.name === "TokenExpiredError"
        res.status(401).json({
            error: true,
            code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
            message: isExpired
            ? "Token has expired, please login again"
            : "Invalid token.",
        });
    }
 };