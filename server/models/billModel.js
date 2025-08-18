import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    billName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    frequency: {
      type: String,
      enum: ["one-time", "weekly", "monthly", "quarterly", "yearly"],
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    setReminder: {
      type: Boolean,
      default: false,
    },
    reminderDate: {
      type: Date,
      // Only required if setReminder is true, refering to setReminder
      required: function () {
        return this.setReminder;
      },
    },
    paymentMethod: {
      type: String,
      enum: ["card", "bank", "upi", "cash"],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);
