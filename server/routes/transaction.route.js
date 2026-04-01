import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addTransaction,
  deleteExpense,
  getUserExpenses,
} from "../controller/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.post("/add-transaction", authMiddleware, addTransaction);
transactionRouter.get("/get-expenses", authMiddleware, getUserExpenses);
transactionRouter.delete("/delete-expense/:id", authMiddleware, deleteExpense);

export default transactionRouter;
