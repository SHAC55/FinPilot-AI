import React, { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../context/appContext";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SummaryCard = () => {
  const { expenses,credit,debit, getCompletedDebit,getCompletedCredit } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() =>  {
    getCompletedCredit()
    getCompletedDebit()
  },[])

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    expenses.forEach((e) => {
      if (e.type === "income") income += e.amount;
      else if (e.type === "expense") expense += e.amount;
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [expenses]);
  

  const summaryItems = [
    {
      label: "Total Income",
      value: `₹${totalIncome}`,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      label: "Total Spent",
      value: `₹${totalExpense}`,
      bg: "bg-red-100",
      text: "text-red-600",
    },
    {
      label: "Remaining",
      value: `₹${balance}`,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      label: "Credit Remaining",
      value: credit.length,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      navigatePath: "/credit", 
    },
    {
      label: "Debit Remaining",
      value: debit.length,
      bg: "bg-purple-100",
      text: "text-purple-600",
      navigatePath: "/debit",
    },
  ];

  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Add Expense Button */}
        <button
          onClick={() => navigate("/transaction-form")}
          className="flex items-center justify-center rounded-xl h-32 bg-blue-700 hover:bg-blue-800 transition-colors duration-200 shadow-md"
        >
          <MdOutlinePlaylistAdd size={50} color="white" />
        </button>

        {/* Summary Cards */}
        {summaryItems.map((item, index) => {
          const isClickable = item.navigatePath ? true : false;

          return (
            <div
              key={index}
              onClick={() => isClickable && navigate(item.navigatePath)}
              className={`p-4 rounded-xl shadow-md flex flex-col justify-center items-center ${item.bg} ${
                isClickable ? "cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200" : ""
              }`}
            >
              <p className={`text-2xl font-bold ${item.text}`}>{item.value}</p>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryCard;
