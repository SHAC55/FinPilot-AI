import mongoose from "mongoose";

const debitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    notes: { type: String },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Debit  = mongoose.model("Debit", debitSchema)
export default Debit;
