import Ledger from "../models/ledger.model.js";

export const addLedger = async (req, res) => {
  try {
    const { name, amount, type, notes, deadline } = req.body;

    // Validation
    if (!name || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: "Name, amount and type are required",
      });
    }

    if (!["credit", "debit"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be credit or debit",
      });
    }

    const newLedger = await Ledger.create({
      userId: req.user._id, // from auth middleware
      name,
      amount,
      type,
      notes,
      deadline,
    });

    return res.status(201).json({
      success: true,
      message: "Ledger entry added successfully",
      data: newLedger,
    });
  } catch (error) {
    console.error("Add Ledger Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getLedger = async (req, res) => {
  try {
    const ledger = await Ledger.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ledger,
    });
  } catch (error) {
    console.error("Get Ledger Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const ledger = await Ledger.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ledger entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete Ledger Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const markLedgerCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const ledger = await Ledger.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { status: "completed" },
      { new: true }
    );

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Marked as completed",
      data: ledger,
    });
  } catch (error) {
    console.error("Update Ledger Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};