import express from "express";
import { loginUser, registerUser, searchUser, } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router()

authRouter.post('/login',loginUser)
authRouter.post('/register', registerUser)
authRouter.get('/searchuser',authMiddleware,searchUser)

export default authRouter ;