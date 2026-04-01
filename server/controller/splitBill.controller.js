import SplitBill from "../models/splitBill.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/emailService.js";
import { buildSplitBillEmail } from "../utils/emailTemplates/buildSplitBillEmail.js";

export const createBill = async (req, res) => {
  try {
    const { title, totalAmount, participants, splits, paidBy } = req.body;

    //  Validate totals (optional but recommended)
    const totalPaid = splits.reduce((acc, s) => acc + s.amountPaid, 0);
    const totalOwed = splits.reduce((acc, s) => acc + s.amountOwed, 0);

    // if (totalOwed !== totalAmount) {
    //   return res.status(400).json({
    //     message: "Total owed must equal total amount",
    //   });
    // }

    const bill = await SplitBill.create({
      title,
      totalAmount,
      participants,
      splits,
      paidBy,
      createdBy: req.user.id,
      date: new Date(),
    });

    //  Fetch users
    const users = await User.find({ _id: { $in: participants } });

    const payer = await User.findById(paidBy);

    //  Send email to each participant
    for (const user of users) {
      const userSplit = splits.find(
        (s) => s.user.toString() === user._id.toString(),
      );

      await sendEmail({
        to: user.email,
        subject: `💸 New SplitBill: ${title}`,
        html: buildSplitBillEmail({
          name: user.username,
          billTitle: title,
          amount: userSplit?.amountOwed || 0,
          paidBy: payer?.username || "Someone",
        }),
      });
    }

    res.status(201).json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const settlePayment = async (req, res) => {
  try {
    const { id, userId } = req.body;

    const bill = await SplitBill.findById(id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const split = bill.splits.find((s) => s.user.toString() === userId);

    if (!split) {
      return res.status(404).json({ message: "User not found in bill" });
    }

    //  ONLY CHANGE STATUS
    split.status = "settled";

    // optional: make UI consistent
    split.amountPaid = split.amountOwed;

    await bill.save();

    res.json({
      message: "Payment settled successfully",
      split,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSummary = async (req, res) => {
  const userId = req.user.id;

  const bills = await SplitBill.find({
    participants: userId,
  });

  let youOwe = 0;
  let youAreOwed = 0;

  bills.forEach((bill) => {
    bill.splits.forEach((split) => {
      if (split.user.toString() === userId) {
        if (bill.paidBy.toString() !== userId) {
          youOwe += split.amountOwed - split.amountPaid;
        }
      } else {
        if (bill.paidBy.toString() === userId) {
          youAreOwed += split.amountOwed - split.amountPaid;
        }
      }
    });
  });

  res.json({ youOwe, youAreOwed });
};

export const getAllBills = async (req, res) => {
  try {
    const bills = await SplitBill.find({
      participants: req.user.id,
    }).populate("participants paidBy");

    res.json({ data: bills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { splits } = req.body;

    const bill = await SplitBill.findById(id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    //  Update splits
    bill.splits = splits;
    await bill.save();

    //  Fetch users
    const users = await User.find({ _id: { $in: bill.participants } });

    const payer = await User.findById(bill.paidBy);

    //  Prepare participant names
    const participantNames = users.map((u) => u.username);

    //  Prepare split details (for email table)
    const splitDetails = splits.map((s) => {
      const u = users.find((user) => String(user._id) === String(s.user));

      return {
        name: u?.username || "User",
        amountPaid: s.amountPaid || 0,
        amountOwed: s.amountOwed || 0,
      };
    });

    // Send emails (parallel ⚡)
    await Promise.all(
      users.map((user) => {
        const userSplit = splits.find(
          (s) => String(s.user) === String(user._id),
        );

        return sendEmail({
          to: user.email,
          subject: `🔄 SplitBill Updated: ${bill.title}`,
          html: buildSplitBillEmail({
            name: user.username,
            billTitle: bill.title,
            totalAmount: bill.totalAmount,
            amount: userSplit?.amountOwed || 0,
            paidBy: payer?.username || "Someone",
            participants: participantNames,
            splits: splitDetails,
            date: bill.date,
          }),
        });
      }),
    );

    res.json({
      message: "Bill updated & users notified",
      bill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await SplitBill.findById(id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Optional: only creator can delete
    if (bill.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await bill.deleteOne();

    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
