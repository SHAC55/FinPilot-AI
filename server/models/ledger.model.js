import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Ledger", ledgerSchema);
