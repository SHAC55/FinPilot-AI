import React, { useContext, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
import { AppContext } from "../context/appContext";
import {
  PieChart as PieChartIcon,
  Tag,
  Percent,
  Filter,
  X,
  Calendar,
} from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ec489a",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="#111827"
        className="text-sm font-semibold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill="#6b7280"
        className="text-xs"
      >
        ${value.toLocaleString()}
      </text>
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        fill="#9ca3af"
        className="text-xs"
      >
        ({`${(percent * 100).toFixed(0)}%`})
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.3}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const DashboardPieChart = () => {
  const { expenses } = useContext(AppContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Get unique years from expenses
  const availableYears = useMemo(() => {
    const years = new Set();
    expenses.forEach((e) => {
      if (e.type === "expense") {
        const year = new Date(e.date).getFullYear();
        years.add(year);
      }
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
    let filtered = expenses.filter((e) => e.type === "expense");

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

  // Convert filtered expenses → category-wise data
  const data = useMemo(() => {
    const map = {};

    filteredExpenses.forEach((e) => {
      if (e.type === "expense") {
        map[e.category] = (map[e.category] || 0) + e.amount;
      }
    });

    return Object.keys(map)
      .map((key) => ({
        name: key,
        value: map[key],
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

   const total= data.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: ${data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Percentage: {percentage}%</p>
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

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <PieChartIcon className="w-4 h-4 text-white" />
              </div>
              Expense Categories
            </h2>
            {/* <p className="text-sm text-gray-500 mt-1">Breakdown by category</p> */}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white text-sm"
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
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white text-sm"
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
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend with percentages */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {data.map((item, i) => {
                const percent = ((item.value / total) * 100).toFixed(1);
                const barWidth = percent;

                return (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-gray-700 font-medium truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">
                          ${item.value.toLocaleString()}
                        </span>
                        <span className="text-gray-900 font-semibold text-xs">
                          {percent}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          background: COLORS[i % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Expense Data Available
            </h3>
            <p className="text-sm text-gray-500 text-center">
              {isFilterActive
                ? "No expenses found for the selected filters"
                : "Add your first expense to see category breakdown"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPieChart;
