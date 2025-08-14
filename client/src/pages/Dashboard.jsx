import React from "react";
import DashboardAnalytics from "../components/DashboardAnalytics";
import BillReminderButton from "../components/BillReminderButton";
import SplitBillButton from "../components/SplitBillButton";
import ExpenseAddButton from "../components/ExpenseAddButton";
import AiBudgetAnalysis from "../components/AiBudgetAnalysis";

const Dashboard = () => {
  return (
    <div className="p-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6 ">
        <BillReminderButton />
        <SplitBillButton />
        <ExpenseAddButton />
      </div>

      {/* Analytics Section */}
      <div className="flex flex-col lg:flex-row gap-3 w-full">
        <div className="flex-1">
          <DashboardAnalytics />
        </div>
        <div className="flex-1">
          <AiBudgetAnalysis />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
