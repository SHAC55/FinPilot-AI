import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { addLedger, deleteLedger, getLedger, markLedgerCompleted } from "../controller/ledger.controller.js";

const ledgerRouter = express.Router();

ledgerRouter.post("/add", authMiddleware, addLedger);
ledgerRouter.get("/", authMiddleware, getLedger);
ledgerRouter.delete("/delete/:id", authMiddleware, deleteLedger);
ledgerRouter.patch("/complete/:id", authMiddleware, markLedgerCompleted);

export default ledgerRouter;