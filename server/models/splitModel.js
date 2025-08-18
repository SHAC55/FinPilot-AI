import mongoose from "mongoose";

const splitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
      username: { type: String, required: true },
      email: { type: String, required: true },
      amountPaid: { type: Number, default: 0 },
      amountOwed: { type: Number, default: 0 },
    },
  ],
  totalAmount: { type: Number, required: true },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

const Split = mongoose.model("Split", splitSchema);
export default Split;
