import Goal from "../models/goal.model.js";
import dotenv from "dotenv";
dotenv.config();



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


