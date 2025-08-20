import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addFund, addGoal, analyzeGoal, deleteGoal, getAllUserGoal, getCompletedGoal, markGoalAsCompleted } from "../controller/goalController.js";

const goalRouter = express.Router();

goalRouter.post("/add-goal", authMiddleware, addGoal);
goalRouter.get("/getallgoals", authMiddleware, getAllUserGoal);
goalRouter.delete("/delete-goal/:id", authMiddleware, deleteGoal);
goalRouter.patch("/addfund/:id",authMiddleware,addFund)
goalRouter.patch('/:id',authMiddleware,markGoalAsCompleted)
goalRouter.get('/completedgoals',authMiddleware,getCompletedGoal)

// ai
goalRouter.get("/analyze-goal/:id", authMiddleware, analyzeGoal);


export default goalRouter;
