import React from "react";
import DashboardAnalytics from "../components/DashboardAnalytics";
import AiBudgetAnalysis from "../components/AiBudgetAnalysis";
import QuickButtonDash from "../components/QuickButtonDash";


const Dashboard = () => {

  return (
    <div className="p-6 w-full">
      {/* Action Buttons */}
      <QuickButtonDash/>
     

      {/* Analytics Section */}
      <div className="flex flex-col lg:flex-row gap-3 w-full h-full ">
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
