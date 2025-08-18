import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import { FaRupeeSign, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const CompletedBillsArchive = () => {
  const { getCompletedBills, completedBills } = useContext(AppContext);

  useEffect(() => {
    getCompletedBills();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Completed Bills Archive
      </h2>

      {completedBills.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          No completed bills yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedBills.map((bill, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 p-5 flex flex-col"
            >
              {/* Bill Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 text-xl" />
                  <span className="font-semibold text-gray-800">
                    {bill.name}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  #{bill.id || index + 1}
                </span>
              </div>

              {/* Bill Details */}
              <span className="text-lg font-medium">{bill.billName}</span>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                
                <FaRupeeSign className="text-gray-400" />
                
                <span className="text-lg font-medium">{bill.amount}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendarAlt className="text-gray-400" />
                <span className="text-sm">
                  Paid on:{" "}
                  {new Date(bill.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedBillsArchive;
