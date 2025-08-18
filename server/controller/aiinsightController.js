import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import Transaction from "../models/transactionModel.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const financeAnalysisAI = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    // Get last 30 days transactions
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: last30Days },
    }).lean();

    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: "No transactions found in the last 30 days",
      });
    }

    const summary = transactions.map((t) => ({
      title: t.title,
      amount: t.amount,
      category: t.category,
      type: t.type,
      date: t.date,
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a certified financial advisor in India. 
Analyze the user's last 30 days transaction data and return insights in JSON format only. 

Transaction data:
${JSON.stringify(summary)}

Return JSON with the following fields:

{
  "spendingTrend": "Short sentence about increase/decrease in spending",
  "savingOpportunities": ["string", ...],
  "topCategories": [
    { "category": "string", "totalSpent": number }
  ],
  "finalTip": "One practical short financial tip"
}

Rules:
- All fields must be filled, no null/undefined/empty values.
- Keep sentences short and professional.
- Use INR currency context.
- Suggested saving opportunities must be realistic for an average Indian user.
- Only output valid JSON, no extra text.
`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    res.status(200).json({
      success: true,
      analysis: aiResponse,
    });
  } catch (err) {
    console.error("AI Budget Analysis Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to analyze budget",
      error: err.message,
    });
  }
};
