import Goal from "../models/goalModel.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeGoal = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the goal for this user
    const goal = await Goal.findOne({ _id: id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create AI prompt
    const prompt = `
You are a certified financial advisor in India.

The user’s goal details:
- Goal name: ${goal.goalName}
- Target amount: ₹${goal.targetAmount}
- Saved amount: ₹${goal.savedAmount}
- Deadline: ${goal.deadline ? goal.deadline.toDateString() : "Not specified"}

You MUST return a JSON object with all of these required, non-empty fields:

{
  "monthlySaving": "Number or string explaining required monthly saving",
  "inflationAdjustedTarget": number,
  "investmentPlan": [
    {
      "risk": "Low",
      "option": "string",
      "expectedReturn": "string",
      "estimatedTotalValue": "string",
      "pros": ["string", ...],
      "cons": ["string", ...],
      "taxImplications": "string"
    },
    {
      "risk": "Medium",
      "option": "string",
      "expectedReturn": "string",
      "estimatedTotalValue": "string",
      "pros": ["string", ...],
      "cons": ["string", ...],
      "taxImplications": "string"
    },
    {
      "risk": "High",
      "option": "string",
      "expectedReturn": "string",
      "estimatedTotalValue": "string",
      "pros": ["string", ...],
      "cons": ["string", ...],
      "taxImplications": "string"
    }
  ],
  "keyRisks": ["string", ...],
  "priorityActionsNext3Months": ["string", ...],
  "suggestedFinancialTools": ["string", ...],
  "finalTip": "string"
}

Rules:
- All fields are mandatory, no empty strings, null, or undefined values.
- Use realistic India-specific financial options (FDs, RDs, PPF, NPS, Mutual Funds, ETFs).
- Inflation-adjusted target assumes 6% annual inflation.
- Monthly saving should be realistic given the target and time left.
- Tax implications must be explained simply for each risk level.
- Priority actions should be clear, short-term, and time-bound.
- Suggested tools can be apps, calculators, or services available in India.
- Return only pure JSON — no extra text or formatting.
`;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    res.status(200).json({
      success: true,
      goalId: goal._id,
      analysis: aiText,
    });
  } catch (error) {
    console.error("AI analysis error:", error);
    res.status(500).json({
      success: false,
      message: "AI analysis failed",
      error: error.message,
    });
  }
};


export const addGoal = async (req, res) => {
  try {
    const { goalName, targetAmount, deadline, savedAmount } = req.body;

    // Validate required fields
    if (!goalName || !targetAmount || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Create new goal
    const newGoal = await Goal.create({
      user: req.user._id,
      goalName,
      targetAmount,
      deadline,
      savedAmount: savedAmount || 0,
    });

    res.status(201).json({
      success: true,
      data: newGoal,
      message: "Goal created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUserGoal = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching goals",
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByIdAndDelete( id );

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Debit not found" });
    }

    res.json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const addFund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; 

    // Validate amount
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid amount" });
    }

    // Find goal and increment savedAmount
    const goal = await Goal.findByIdAndUpdate(
      id,
      { $inc: { savedAmount: amount } }, // increment field
      { new: true } // return updated document
    );

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    res.json({
      success: true,
      message: "Funds added successfully",
      data: goal,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


