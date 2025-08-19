// utils/monthlyArchiveJob.js
import cron from "node-cron";
import Transaction from "../models/transactionModel.js";
import Archive from "../models/archiveModel.js";

// Run at 12:00 AM on the 1st of every month
cron.schedule("0 0 1 * *", async () => {
    console.log("Running test archive job...");
  try {
    const now = new Date();
    const prevMonth = now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1;
    const year = prevMonth === 11 ? now.getFullYear() - 1 : now.getFullYear();

    const startDate = new Date(year, prevMonth, 1);
    const endDate = new Date(year, prevMonth + 1, 0, 23, 59, 59);

    // Get all transactions of previous month
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
    });

    if (transactions.length > 0) {
      // Group by user
      const userTransactions = {};
      transactions.forEach((t) => {
        if (!userTransactions[t.userId]) {
          userTransactions[t.userId] = [];
        }
        userTransactions[t.userId].push(t);
      });

      // Save archive per user
      for (const userId in userTransactions) {
        await Archive.create({
          userId,
          month: prevMonth + 1, // JS months are 0-based
          year,
          transactions: userTransactions[userId],
        });
      }

      // Delete archived transactions
      await Transaction.deleteMany({
        date: { $gte: startDate, $lte: endDate },
      });

      console.log(`✅ Archived and reset transactions for ${month + 1}/${year}`);
    } else {
      console.log("ℹ️ No transactions to archive this month");
    }
  } catch (error) {
    console.error("❌ Error archiving transactions:", error);
  }
});
