import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectMongoDB from "./config/mongoDB.js";
import authRouter from "./routes/auth.route.js";
import transactionRouter from "./routes/transaction.route.js";
import goalRouter from "./routes/goals.route.js";

import walletRouter from "./routes/wallet.route.js";
import ledgerRouter from "./routes/ledger.route.js";
import aiRouter from "./routes/ai.routes.js";
import splitBillRouter from "./routes/splitBill.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectMongoDB();

// middleware

const allowedOrigins = [
  "http://localhost:5173",
  "https://finpilotai.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// All Router
app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/goal", goalRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/ledger", ledgerRouter);
app.use("/api/ai", aiRouter);
app.use("/api/split-bills", splitBillRouter);

// API Endpoint
app.get("/", (req, res) => {
  res.send("Finpilot API is running...");
});

// port listening
app.listen(PORT, () => console.log(`✅ Backend is working on port ${PORT}`));
