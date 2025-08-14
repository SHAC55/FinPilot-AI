// src/components/MonthlyTrendsChart.jsx
import React from "react";
import { prepareMonthlyData } from "../utils/analytics";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const MonthlyTrendsChart = ({ transactions }) => {
  const monthlyData = prepareMonthlyData(transactions);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#F44336" name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendsChart;
