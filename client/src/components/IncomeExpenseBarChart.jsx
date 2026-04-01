import React, { useContext, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AppContext } from "../context/appContext";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  X,
  IndianRupee,
} from "lucide-react";

const IncomeExpenseBarChart = () => {
  const { expenses } = useContext(AppContext);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Get unique years from expenses
  const availableYears = useMemo(() => {
    const years = new Set();
    expenses.forEach((e) => {
      const year = new Date(e.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [expenses]);

  // Get unique months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Filter expenses based on selected month and year
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (selectedYear !== "all") {
      filtered = filtered.filter((e) => {
        const year = new Date(e.date).getFullYear();
        return year === parseInt(selectedYear);
      });
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((e) => {
        const month = new Date(e.date).getMonth();
        return month === parseInt(selectedMonth);
      });
    }

    return filtered;
  }, [expenses, selectedMonth, selectedYear]);

  // Group by month
  const data = useMemo(() => {
    const map = {};

    filteredExpenses.forEach((e) => {
      const date = new Date(e.date);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!map[key]) {
        map[key] = {
          month: key,
          monthShort: month,
          year: year,
          income: 0,
          expense: 0,
          fullDate: date,
        };
      }

      if (e.type === "income") {
        map[key].income += e.amount;
      } else {
        map[key].expense += e.amount;
      }
    });

    // Sort by date
    return Object.values(map).sort((a, b) => a.fullDate - b.fullDate);
  }, [filteredExpenses]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    return { totalIncome, totalExpense, netSavings, savingsRate };
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-gray-600 capitalize">{item.dataKey}:</span>
              <span className="font-semibold text-gray-900">
                ${item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleResetFilters = () => {
    setSelectedMonth("all");
    setSelectedYear("all");
  };

  const isFilterActive = selectedMonth !== "all" || selectedYear !== "all";

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl  border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-white" />
              </div>
              Income vs Expense Analysis
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Monthly financial overview
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-sm"
              >
                <option value="all">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-sm"
              >
                <option value="all">All Months</option>
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {isFilterActive && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition flex items-center gap-2 text-sm text-gray-700"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6">
        {data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="monthShort"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="income"
                  fill="url(#incomeGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
                <Bar
                  dataKey="expense"
                  fill="url(#expenseGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full" />
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600">Expense</span>
              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Data Available
            </h3>
            <p className="text-sm text-gray-500 text-center">
              {isFilterActive
                ? "No transactions found for the selected filters"
                : "Add your first income or expense to see the chart"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeExpenseBarChart;
