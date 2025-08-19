// models/archiveModel.js
import mongoose from "mongoose";

const archiveSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: Number, required: true },   // e.g. 7 for July
    year: { type: Number, required: true },    // e.g. 2025
    transactions: [
      {
        title: String,
        amount: Number,
        date: Date,
        category: String,
        method: String,
        notes: String,
        type: String,
      },
    ],
    archivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Archive = mongoose.model("Archive", archiveSchema);
export default Archive;
