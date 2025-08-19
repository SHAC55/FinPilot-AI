import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import connectMongoDB from "./config/mongoDB.js";
import authRouter from "./routes/authRoute.js";
import transactionRouter from "./routes/transactionRoute.js";
import goalRouter from "./routes/goalsRoute.js";
import billsRouter from "./routes/billsRoute.js";
import splitRouter from "./routes/splitRoute.js";
import "./utils/reminderScheduler.js";
import financeAnalysisRouter from "./routes/aianalysisRoute.js";
import "./utils/monthlyArchiveJob.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectMongoDB();

// middleware
app.use(cors());
app.use(express.json());


app.use(passport.initialize());
app.use(passport.session());

// All Router
app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/goal", goalRouter);
app.use("/api/bill", billsRouter);
app.use("/api/split", splitRouter);
app.use("/api/finance", financeAnalysisRouter);

// API Endpoint
app.get("/", (req, res) => {
  res.send("FUNFUSION");
});

// port listening
app.listen(PORT, () =>
  console.log(`✅ Backend is working on port ${PORT}`)
);
