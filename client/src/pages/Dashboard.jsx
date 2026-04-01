import React from "react";
import DashboardStats from "../components/DashboardStats";
import QuickButton from "../components/QuickButton";
import DashboardPieChart from "../components/DashboardPieChart";
import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";

const Dashboard = () => {
  return (
    <div className="">

      {/* Stats */}
      <DashboardStats />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-14 p-5">

        {/* Left Side - Bar Chart */}
        <div className="lg:col-span-2">
          <IncomeExpenseBarChart />
        </div>

        {/* Right Side - Pie Chart */}
        <DashboardPieChart />

      </div>

      {/* Bottom Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-2xl font-semibold ml-5 ">
          Quick Actions
        </h2>
        <QuickButton />
      </div>

    </div>
  );
};

export default Dashboard;