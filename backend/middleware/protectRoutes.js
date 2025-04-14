import jwt from "jsonwebtoken";
import db from "../config/db.config.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        console.log("ProtectRoute - Token received:", token ? "Present" : "Missing");

        if (!token) {
            console.log("ProtectRoute - No token provided");
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided",
            });
        }

        console.log("ProtectRoute - Verifying token...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("ProtectRoute - Token decoded:", decoded);

        console.log("ProtectRoute - Checking manager with ID:", decoded.id);
        const [users] = await db.query("SELECT * FROM managers WHERE id = ?", [decoded.id]);
        if (users.length === 0) {
            console.log("ProtectRoute - Manager not found for ID:", decoded.id);
            return res.status(401).json({
                success: false,
                message: "Not authorized, user not found",
            });
        }

        const { password, ...userData } = users[0];
        req.user = userData;
        console.log("ProtectRoute - Manager authenticated:", userData.id);
        next();
    } catch (error) {
        console.error("ProtectRoute - Error:", error.name, error.message);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Not authorized, invalid or expired token",
            });
        }
        console.error("ProtectRoute - Server error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};