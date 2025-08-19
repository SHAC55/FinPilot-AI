import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  splits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Split" }],
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Goal" }],
  credits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Credit" }],
  debits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Debit" }],
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
  password: { type: String, required: true },
  otp: {
  code: { type: String },
  expiresAt: { type: Date },
},
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
