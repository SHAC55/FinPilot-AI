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
      You are a financial advisor in India.
      The user has the following goal:
      Goal name: ${goal.goalName}
      Target amount: ₹${goal.targetAmount}
      Saved amount: ₹${goal.savedAmount}
      Deadline: ${goal.deadline ? goal.deadline.toDateString() : "Not specified"}

      Provide:
      "Act as a financial advisor . Based on the user's goal amount, target date, and current savings capacity, provide:
      1. A realistic monthly saving or investment amount to reach the goal on time.
      2. An investment plan with 2-3 suitable options in India (low, medium, and high risk).
      3. Expected returns for each option and estimated total value at the end of the period.
      4. Key risks or market factors to monitor.
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


