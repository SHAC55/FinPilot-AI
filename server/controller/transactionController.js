import Credit from "../models/creditModel.js";
import Debit from "../models/debitModel.js";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";

export const addExpense = async (req, res) => {
  try {
    const { title, amount, date, category, method, notes, type } = req.body;

    // Validation
    if (!title || !amount || !date || !type) {
      return res.status(400).json({
        success: false,
        message: "Please fill required fields",
      });
    }

    // Create and save expense/income
    const expense = new Transaction({
      title,
      amount,
      date,
      category,
      method,
      notes,
      type,
      userId: req.user._id,
    });

    const savedExpense = await expense.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { expenses: savedExpense._id },
    });

    res.status(201).json({
      success: true,
      message: `${type === "income" ? "Income" : "Expense"} added successfully`,
      data: savedExpense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserExpenses = async (req, res) => {
  try {
    const userId = req.user._id;

    const expenses = await Transaction.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const expense = await Transaction.findOne({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or unauthorized",
      });
    }

    await Transaction.findByIdAndDelete(id);

    await User.findByIdAndUpdate(userId, {
      $pull: { expenses: id },
    });

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// <--- CREDIT SECTION --->
export const addCredit = async (req, res) => {
  try {
    const { title, amount, notes, completed, deadline } = req.body;
    const userId = req.user._id;

    // Validation
    if (!title || !amount || !notes || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // Create and save credit
    const credit = new Credit({
      title,
      amount,
      notes,
      completed: completed ?? false, // default to false if not provided
      deadline,
      userId,
    });

    const savedCredit = await credit.save();

    // Link to user
    await User.findByIdAndUpdate(userId, {
      $push: { credit: savedCredit._id },
    });

    // Success response
    return res.status(201).json({
      success: true,
      message: "Credit added successfully",
      data: savedCredit,
    });
  } catch (error) {
    console.error("Error adding credit:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

export const getUserCredit = async (req, res) => {
  try {
    const credits = await Credit.find({
      userId: req.user.id,
      completed: false,
    });

    res.status(200).json({ success: true, data: credits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markCreditAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCredit = await Credit.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );

    if (!updatedCredit) {
      return res
        .status(404)
        .json({ success: false, message: "Credit not found" });
    }

    res.status(200).json({
      success: true,
      message: "Credit marked as completed",
      data: updatedCredit,
    });
  } catch (error) {
    console.error("Error marking as completed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCredit = async (req, res) => {
  try {
    const { id } = req.params;
    const credit = await Credit.findByIdAndDelete(id);

    if (!credit) {
      return res
        .status(404)
        .json({ success: false, message: "Credit not found" });
    }

    res.json({ success: true, message: "Credit deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getArchivedCredit = async (req, res) => {
  try {
    const completedCredits = await Credit.find({
      userId: req.user.id,
      completed: true,
    });

    res.json(completedCredits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// <--- DEBIT SECTION --->
export const addDebit = async (req, res) => {
  try {
    const { title, amount, notes, completed, deadline } = req.body;
    const userId = req.user._id;

    // Validation
    if (!title || !amount || !notes || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // Create and save credit
    const debit = new Debit({
      title,
      amount,
      notes,
      completed: completed ?? false, // default to false if not provided
      deadline,
      userId,
    });

    const savedDebit = await debit.save();

    // Link to user
    await User.findByIdAndUpdate(userId, {
      $push: { dedit: savedDebit._id },
    });

    // Success response
    return res.status(201).json({
      success: true,
      message: "Debit added successfully",
      data: savedDebit,
    });
  } catch (error) {
    console.error("Error adding credit:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

export const getUserDebit = async (req, res) => {
  try {
    const debits = await Debit.find({
      userId: req.user.id,
      completed: false,
    });

    res.status(200).json({ success: true, data: debits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markDebitAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedDebit = await Debit.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );

    if (!updatedDebit) {
      return res
        .status(404)
        .json({ success: false, message: "Debit not found" });
    }

    res.status(200).json({
      success: true,
      message: "Debit marked as completed",
      data: updatedDebit,
    });
  } catch (error) {
    console.error("Error marking as completed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteDebit = async (req, res) => {
  try {
    const { id } = req.params;
    const debit = await Debit.findByIdAndDelete(id);

    if (!debit) {
      return res
        .status(404)
        .json({ success: false, message: "Debit not found" });
    }

    res.json({ success: true, message: "Debit deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getArchivedDebit = async (req, res) => {
  try {
    const completedDebits = await Debit.find({
      userId: req.user.id,
      completed: true,
    });

    res.json(completedDebits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
