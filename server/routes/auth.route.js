import express from "express";
import {
    forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  searchUser,
  verifyOtp,
} from "../controller/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.get("/searchuser", authMiddleware, searchUser);
// authRouter.post("/request-otp", requestOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;
