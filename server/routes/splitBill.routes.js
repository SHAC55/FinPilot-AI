import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createBill, deleteBill, getAllBills, settlePayment, updateBill } from "../controller/splitBill.controller.js";


const splitBillRouter = express.Router();

//  Create bill
splitBillRouter.post("/create", authMiddleware, createBill);

//  Settle payment
splitBillRouter.post("/settle", authMiddleware, settlePayment);

// //  Dashboard summary
// splitBillRouter.get("/summary", authMiddleware, getSummary);

splitBillRouter.get("/", authMiddleware, getAllBills);

splitBillRouter.put("/update/:id",authMiddleware,updateBill)

splitBillRouter.delete("/:id", authMiddleware, deleteBill);

export default splitBillRouter;