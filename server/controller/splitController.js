import Split from "../models/splitModel.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

export const addSplit = async (req, res) => {
  try {
    const { title, totalAmount, participants, notes } = req.body;
    const userId = req.user._id;

    if (!title || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Title and total amount are required",
      });
    }

    // Convert participants.user to ObjectId
   const formattedParticipants = participants.map((p) => ({
  createdBy: new mongoose.Types.ObjectId(userId),
  username: p.username,
  email: p.email,
  amountPaid: Number(p.amountPaid) || 0,
  amountOwed: Number(p.amountOwed) || 0,
}));


    const newSplit = new Split({
      title,
      totalAmount,
      participants: formattedParticipants,
      createdBy: userId,
      notes,
      date: new Date(),
    });

    await newSplit.save();

    const populatedSplit = await newSplit.populate([
      { path: "participants.user", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      data: populatedSplit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteSplit = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const split = await Split.findById(id);

    if (!split) {
      return res.status(404).json({
        success: false,
        message: "Split not found",
      });
    }

    if (split.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this split",
      });
    }

    await split.deleteOne();

    res.status(200).json({
      success: true,
      message: "Split deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const fetchAllSplits = async (req, res) => {
  const userId = req.user._id;

  try {
    const split = await Split.find({
      $or: [{ createdBy: userId }, { "participants.user": userId }],
    })
      .populate("participants.user", "name email")
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: split,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateSplit = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId, amountPaid, amountOwed } = req.body;

    const split = await Split.findById(id);
    if (!split) {
      return res.status(404).json({ message: "Split not found" });
    }

    // Check if the logged-in user is the creator of this split
    if (split.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this split" });
    }

    // Find the participant inside the split
    const participant = split.participants.find(
      (p) => p._id.toString() === participantId
    );

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Update values (only if provided)
    if (amountPaid !== undefined) participant.amountPaid = Number(amountPaid);
    if (amountOwed !== undefined) participant.amountOwed = Number(amountOwed);

    // Save changes
    await split.save();

    res.status(200).json({
      success: true,
      message: "Participant amounts updated successfully",
      data: split,
    });
  } catch (error) {
    console.error("Error updating participant amounts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const sendReminder = async (req, res) => {
  try {
    const split = await Split.findById(req.params.id).populate(
      "participants.user"
    );
    if (!split) return res.status(404).json({ message: "Split not found" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailPromises = split.participants
      .filter((p) => p.user && p.user.email && p.amountOwed > 0)
      .map((p) => {
        return transporter.sendMail({
          from: `"FinPilot AI" <${process.env.EMAIL_USER}>`,
          to: p.user.email,
          subject: `Reminder: Payment for ${split.title}`,
          text: `Hi ${
            p.user.username || "User"
          },\n\nThis is a friendly reminder that you owe ₹${
            p.amountOwed
          } for "${split.title}".\n\nThanks!`,
        });
      });

    await Promise.all(emailPromises);
    res.json({ message: "Reminders sent successfully" });
  } catch (err) {
    console.error("SendReminder Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateAmountsAndNotify = async (req, res) => {
  try {
    const { participants } = req.body;
    
    const split = await Split.findById(req.params.id).populate(
      "participants.user"
    );
    if (!split) return res.status(404).json({ message: "Split not found" });

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Update participants & send emails
    const emailPromises = [];

    participants.forEach((pUpdate) => {
      const participant = split.participants.find(
        (p) => p.user._id.toString() === pUpdate.userId
      );
      if (participant) {
        if (pUpdate.amountPaid !== undefined)
          participant.amountPaid = pUpdate.amountPaid;
        if (pUpdate.amountOwed !== undefined)
          participant.amountOwed = pUpdate.amountOwed;

        // Only send email if participant has a valid email
        if (participant.user.email) {
          const mailOptions = {
            from: `"Split App" <${process.env.EMAIL_USER}>`,
            to: participant.user.email,
            subject: `Update: Payment for ${split.title}`,
            text: `Hi ${participant.user.name || "User"},\n\nYour split "${
              split.title
            }" has been updated.\nPaid: ₹${participant.amountPaid}\nOwes: ₹${
              participant.amountOwed
            }\n\nThanks!`,
          };
          emailPromises.push(transporter.sendMail(mailOptions));
        }
      }
    });

    // Update totals
    split.totalPaid = split.participants.reduce(
      (sum, p) => sum + p.amountPaid,
      0
    );
    split.totalRemaining = split.totalAmount - split.totalPaid;

    await split.save();

    // Send all emails
    await Promise.all(emailPromises);

    res.json({ message: "Amounts updated and emails sent", split });
  } catch (err) {
    console.error("updateAmountsAndNotify Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const markSplitAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSplit = await Split.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );

    if (!updatedSplit) {
      return res
        .status(404)
        .json({ success: false, message: "Split not found" });
    }

    res.status(200).json({
      success: true,
      message: "Split marked as completed",
      data: updatedSplit,
    });
  } catch (error) {
    console.error("Error marking as completed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCompletedSplits = async (req, res) => {
  try {
    const completedSplits = await Split.find({
      userId: req.user.id,
      completed: true,
    });

    res.json(completedSplits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

