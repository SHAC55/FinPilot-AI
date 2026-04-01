import mongoose from "mongoose";

const splitBillSchema = new mongoose.Schema(
  {
    title: String,
    totalAmount: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    splitType: { type: String, enum: ["equal", "custom"], default: "equal" },
    splits: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amountPaid: { type: Number, default: 0 },
        amountOwed: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ["pending", "settled"],
          default: "pending",
        },
      },
    ],
    date: Date,
  },
  { timestamps: true },
);

export default mongoose.model("SplitBill", splitBillSchema);
