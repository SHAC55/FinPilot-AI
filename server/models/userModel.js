import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  split: [{ type: mongoose.Schema.Types.ObjectId, ref: "Split" }],
  goal: [{ type: mongoose.Schema.Types.ObjectId, ref: "Goal" }],
  credit: [{ type: mongoose.Schema.Types.ObjectId, ref: "Credit" }],
  dredit: [{ type: mongoose.Schema.Types.ObjectId, ref: "Debit" }],
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
  password: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
