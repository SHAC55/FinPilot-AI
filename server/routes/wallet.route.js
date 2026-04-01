import express from "express";
import {
  createWallet,
  getWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
  getTransactionsByWallet,
} from "../controller/wallet.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const walletRouter = express.Router();

walletRouter.post("/create", authMiddleware, createWallet);

walletRouter.get("/", authMiddleware, getWallets);

walletRouter.get("/transactions/:id", authMiddleware, getTransactionsByWallet);

walletRouter.get("/:id", authMiddleware, getWalletById);

walletRouter.put("/:id", authMiddleware, updateWallet);

walletRouter.delete("/:id", authMiddleware, deleteWallet);



export default walletRouter;
