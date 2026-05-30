import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }

    const token = req.cookies.token;

    console.log("=== AUTH DEBUG ===");
    console.log("Cookies:", req.cookies);
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);

    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export default authMiddleware;
