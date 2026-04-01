import express from "express";
import { analyzeExpenses, analyzeGoal } from "../controller/ai.controller.js";


const aiRouter = express.Router();

aiRouter.post("/analyze-expenses", analyzeExpenses);
aiRouter.post("/goal", analyzeGoal);

export default aiRouter;