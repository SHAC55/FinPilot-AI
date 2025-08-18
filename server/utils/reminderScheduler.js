import cron from "node-cron";
import Bill from "../models/billModel.js";
import { sendEmail } from "./emailService.js";

// Run every day at 8 AM
cron.schedule("0 0 * * *", async () => {
  console.log("🚀 Reminder cron running...");

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find bills with reminderDate or deadline = today
    const bills = await Bill.find({
      completed: { $ne: true },
      $or: [
        { reminderDate: { $gte: startOfDay, $lte: endOfDay } },
        { deadline: { $gte: startOfDay, $lte: endOfDay } },
      ],
    }).populate("userId", "email name");

    if (!bills.length) {
      console.log("No reminders or deadlines for today.");
      return;
    }

    for (const bill of bills) {
      const userEmail = bill.userId.email;

      // Send reminder email
      if (bill.setReminder && bill.reminderDate >= startOfDay && bill.reminderDate <= endOfDay) {
        await sendEmail({
          to: userEmail,
          subject: `Reminder: ${bill.billName} is coming up`,
          text: `Hi ${bill.userId.name},\nYour bill "${bill.billName}" of ₹${bill.amount} is due on ${bill.deadline.toDateString()}.`,
        });
        console.log(`✅ Reminder email sent for ${bill.billName} to ${userEmail}`);
      }

      // Send deadline email
      if (bill.deadline >= startOfDay && bill.deadline <= endOfDay) {
        await sendEmail({
          to: userEmail,
          subject: `Deadline: ${bill.billName} is due today`,
          text: `Hi ${bill.userId.name},\nYour bill "${bill.billName}" of ₹${bill.amount} is due today. Please pay on time.`,
        });
        console.log(`✅ Deadline email sent for ${bill.billName} to ${userEmail}`);
      }
    }
  } catch (err) {
    console.error("❌ Error sending scheduled emails:", err);
  }
});
