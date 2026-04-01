import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addFund, addGoal, deleteGoal, getAllUserGoal } from "../controller/goal.controller.js";

const goalRouter = express.Router();

goalRouter.post("/add-goal", authMiddleware, addGoal);
goalRouter.get("/getallgoals", authMiddleware, getAllUserGoal);
goalRouter.delete("/delete-goal/:id", authMiddleware, deleteGoal);
goalRouter.patch("/addfund/:id",authMiddleware,addFund)




export default goalRouter;
