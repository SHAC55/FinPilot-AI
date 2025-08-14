import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import MonthlyTrendsChart from "./MonthlyTrendsChart";

const DashboardAnalytics = () => {
  const { expenses } = useContext(AppContext);

  return (
    <div className="w-full shadow-lg">
      <MonthlyTrendsChart transactions={expenses} />
    </div>
  );
};

export default DashboardAnalytics;
