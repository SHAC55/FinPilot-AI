import Transaction  from "../models/transaction.model.js"
import User from "../models/user.model.js";
import Wallet from "../models/wallet.model.js";

export const addTransaction = async (req, res) => {
  try {
    const {
      title,
      amount,
      date,
      category,
      method,
      notes,
      type,
      wallet,
    } = req.body;

    //  Validation
    if (!title || !amount || !date || !type || !wallet) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Convert amount to number (FIXED)
    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    //  Find wallet
    const walletData = await Wallet.findById(wallet);

    if (!walletData) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    //  Create transaction
    const transaction = new Transaction({
      title,
      amount: numericAmount, 
      date,
      category,
      method,
      notes,
      type,
      userId: req.user._id,
      wallet,
    });

    const savedTransaction = await transaction.save();

    //  Update wallet balance (FIXED)
    if (type === "expense") {
      walletData.balance -= numericAmount;
      walletData.spent += numericAmount;
    } else {
      walletData.balance += numericAmount;
    }

    await walletData.save();

    res.status(201).json({
      success: true,
      message:
        type === "income"
          ? "Income added successfully"
          : "Expense added successfully",
      data: savedTransaction,
    });
  } catch (error) {
    console.error("Add Transaction Error:", error);
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

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // ✅ find wallet
    const wallet = await Wallet.findById(transaction.wallet);

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    //  reverse balance
    if (transaction.type === "expense") {
      wallet.balance += transaction.amount;
      wallet.spent -= transaction.amount;
    } else {
      wallet.balance -= transaction.amount;
    }

    await wallet.save();

    await Transaction.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};  

