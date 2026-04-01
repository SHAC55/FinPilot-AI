import React from "react";
import { CreditCard, ReceiptText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickButton = () => {
  const navigate = useNavigate();

  const action = [
    { icon: <CreditCard size={28} />, name: "Ledger", path: "/ledger" },
    { icon: <ReceiptText size={28} />, name: "Bills", path: "/split-bills" },
  ];

  return (
    <div className="px-4 mt-10">
      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {action.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="group bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              {item.icon}
            </div>

            {/* Text */}
            <h1 className="mt-3 text-sm font-semibold text-gray-700 group-hover:text-gray-900">
              {item.name}
            </h1>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickButton;
