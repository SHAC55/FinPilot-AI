import React from "react";
import { useSplitBill } from "../context/SplitBillContext";

const BillCard = ({ bill }) => {
  const { settlePayment } = useSplitBill();

  return (
    <div className="border rounded-lg p-4 shadow mb-4">
      {/* Title */}
      <h3 className="text-lg font-semibold">{bill.title}</h3>

      {/* Total */}
      <p className="text-gray-600">Total: ₹{bill.totalAmount}</p>

      {/* Splits */}
      <div className="mt-2">
        {bill.splits.map((split) => (
          <div
            key={split.user}
            className="flex justify-between items-center mb-1"
          >
            <span>
              ₹{split.amountOwed} - {split.status}
            </span>

            {split.status !== "settled" && (
              <button
                onClick={() =>
                  settlePayment(bill._id, split.user, split.amountOwed)
                }
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Settle
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillCard;