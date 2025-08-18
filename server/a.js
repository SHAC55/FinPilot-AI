import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Transaction from "./models/transactionModel.js"; // adjust path

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yourdbname";

// ⚡ Config: set how many transactions to add
const NUM_TRANSACTIONS = 100; // change this to add more each run
const USER_ID = "68a323d4d08c5f47b5692ff1"; // replace with real user's _id

const categories = ['Food', 'Transport', 'Rent', 'Entertainment', 'Shopping', 'Medical', 'Sports', 'Other'];
const methods = ['Cash', 'Card', 'UPI', 'Wallet'];
const types = ['income', 'expense'];

const seedTransactions = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB Connected");

    const fakeTransactions = [];

    for (let i = 0; i < NUM_TRANSACTIONS; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomAmount = Math.floor(Math.random() * 5000) + 100; // ₹100 – ₹5000
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - randomDaysAgo);

      fakeTransactions.push({
        userId: USER_ID,
        title: `${randomCategory} ${randomType} ${Date.now()}-${i}`, // unique title
        amount: randomType === 'expense' ? -randomAmount : randomAmount,
        category: randomCategory,
        type: randomType,
        method: randomMethod,
        date: randomDate,
          lastModified: new Date(),
      });
    }

    await Transaction.insertMany(fakeTransactions);
    console.log(`🌱 Added ${NUM_TRANSACTIONS} new transactions!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding transactions:", err);
    process.exit(1);
  }
};

seedTransactions();
