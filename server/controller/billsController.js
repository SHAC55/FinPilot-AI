import Bill from "../models/billModel.js";

export const addBill = async (req, res) => {
  try {
    const {
      billName,
      amount,
      frequency,
      deadline,
      setReminder,
      reminderDate,
      paymentMethod,
      notes,
    } = req.body;

    const userId = req.user._id;

    const newBill = new Bill({
      userId,
      billName,
      amount,
      frequency,
      deadline,
      setReminder,
      reminderDate,
      paymentMethod,
      notes,
    });

    const savedBill = await newBill.save();

    res.status(201).json({
      success: true,
      message: "Bill added successfully",
      data: savedBill,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create bill",
    });
  }
};

export const getUserBills = async (req, res) => {
  try {
    
    const userId = req.user.id;

    // completed: { $ne: true } → $ne means “not equal to”.
   const bills = await Bill.find({ userId, completed: { $ne: true } }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
    });
  }
};

export const markBillAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBill = await Bill.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );

    if (!updatedBill) {
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });
    }

    res.status(200).json({
      success: true,
      message: "Bill marked as completed",
      data: updatedBill,
    });
  } catch (error) {
    console.error("Error marking as completed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCompletedBills = async (req, res) => {
  try {
    const completedBills = await Bill.find({
      userId: req.user.id,
      completed: true,
    });

    res.json(completedBills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findByIdAndDelete(id);

    if (!bill) {
      return res
        .status(404)
        .json({ success: false, message: "bill not found" });
    }

    res.json({ success: true, message: "Bill deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};