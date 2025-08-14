import express from "express";
import { loginUser, registerUser } from "../controller/authController.js";

const authRouter = express.Router()

authRouter.post('/login',loginUser)
authRouter.post('/register', registerUser)

export default authRouter ;