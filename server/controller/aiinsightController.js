import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Transaction from "../models/transactionModel.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// New model to store AI analysis
const transactionAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  analysis: { type: Object, required: true },
  lastUpdated: { type: Date, default: Date.now },
});
const TransactionAnalysis = mongoose.model("TransactionAnalysis", transactionAnalysisSchema);

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

    // Check cached analysis
    const cache = await TransactionAnalysis.findOne({ userId });
    const lastTransaction = await Transaction.findOne({ userId })
      .sort({ lastModified: -1 })
      .lean();

    const twentyFourHours = 24 * 60 * 60 * 1000;

    const shouldRunAI =
      !cache ||
      (new Date() - cache.lastUpdated > twentyFourHours) ||
      (lastTransaction && lastTransaction.lastModified > cache?.lastUpdated);

    if (!shouldRunAI) {
      // Return cached analysis if no changes and cache is recent
      return res.status(200).json({ success: true, analysis: cache.analysis });
    }

    // Prepare summary for AI
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
Analyze the user's last 30 days transaction data and return insights in pure JSON format only.

Transaction data:
${JSON.stringify(summary)}

Return JSON with the following fields:

{
  "spendingTrend": "Short sentence about increase/decrease in spending",
  "savingOpportunities": ["string", ...],
  "topCategories": [
    { "category": "string", "totalSpent": number }
  ],
  "finalTip": "One short, practical financial tip tailored for Indian users"
}

Rules:
- All fields must be filled, no null/undefined/empty values.
- Keep sentences short and professional.
- Use INR currency context.
- Suggested saving opportunities must be realistic for an average Indian user.
- Only output valid JSON, no extra text or code fences.
`;

    const result = await model.generateContent(prompt);

    let aiResponse = result.response.text();
    aiResponse = aiResponse.replace(/```json|```/g, "").trim();

    let aiJson;
    try {
      aiJson = JSON.parse(aiResponse);
    } catch (parseErr) {
      console.error("AI JSON Parse Error:", parseErr, "\nRaw AI Response:", aiResponse);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI analysis",
        error: parseErr.message,
      });
    }

    // Upsert into DB
    await TransactionAnalysis.findOneAndUpdate(
      { userId },
      { analysis: aiJson, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      analysis: aiJson,
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
