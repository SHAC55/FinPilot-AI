import React, { useContext, useMemo, useState } from "react";
import { PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import { AppContext } from "../context/appContext";
import { useWallet } from "../context/WalletContext";

const DashboardStats = () => {
  const { expenses } = useContext(AppContext);
  const { wallets } = useWallet();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  //  Month & Year State
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  //  Filter Expenses by Month & Year
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const date = new Date(e.date);
      return (
        date.getMonth() === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  }, [expenses, selectedMonth, selectedYear]);

  //  Calculate Stats
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredExpenses.forEach((e) => {
      if (e.type === "income") income += e.amount;
      else if (e.type === "expense") expense += e.amount;
    });

    const totalBalance = wallets.reduce(
      (acc, w) => acc + (w.balance || 0),
      0
    );

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: totalBalance,
    };
  }, [filteredExpenses, wallets]);

  const stats = [
    {
      title: "Remaining",
      amount: `₹${balance}`,
      change: "-10% from last period",
      changeColor: "text-red-500",
      icon: <PiggyBank size={20} />,
      bg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Income",
      amount: `₹${totalIncome}`,
      change: "18% from last period",
      changeColor: "text-green-500",
      icon: <TrendingUp size={20} />,
      bg: "bg-green-100 text-green-600",
    },
    {
      title: "Expenses",
      amount: `₹${totalExpense}`,
      change: "33% from last period",
      changeColor: "text-red-500",
      icon: <TrendingDown size={20} />,
      bg: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="bg-blue-600 pt-6 text-white p-5">
      {/* Header */}
      <div className="ml-5">
        <h1 className="text-4xl font-semibold">
          Welcome Back, {user?.username}
        </h1>
        <p className="text-sm text-gray-200 font-semibold">
          This is your financial overview report.
        </p>
      </div>

      {/* Filter UI */}
      <div className="flex gap-4 mt-4 ml-5">
        {/* Month */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="p-2 rounded-md text-black"
        >
          {[
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
          ].map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 rounded-md text-black"
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative top-16">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-md transition duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>

                {/*  Dynamic Date */}
                <p className="text-sm text-gray-500">
                  {new Date(selectedYear, selectedMonth).toLocaleString(
                    "default",
                    { month: "long", year: "numeric" }
                  )}
                </p>
              </div>

              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${item.bg}`}
              >
                {item.icon}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {item.amount}
              </h2>
              <p className={`text-sm mt-1 ${item.changeColor}`}>
                {item.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;