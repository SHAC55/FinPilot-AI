import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import Split from "./pages/Split";
import PlanGoal from "./pages/PlanGoal";
import Archive from "./pages/Archive";
import ExpenseForm from "./pages/ExpenseForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Credit from "./pages/Credit";
import Debit from "./pages/Debit";
import CreditForm from "./pages/CreditForm";
import DebitForm from "./pages/DebitForm";
import CreditArchive from "./pages/CreditArchive";
import DebitArchive from "./pages/DebitArchive";
import AddGoalForm from "./pages/AddGoalForm";
import GoalAnalysisPage from "./pages/GoalAnalysis";
import Profile from "./pages/Profile";
import BillRemiander from "./pages/BillRemiander";
import AddBillForm from "./pages/AddBillForm";
import CompletedBill from "./components/CompletedBill";
import CompletedBillsArchive from "./pages/CompletedBillsArchive";
import AddSplitForm from "./pages/AddSplitForm";
import ArchivedSplits from "./pages/ArchivedSPlits";


const App = () => {
  const location = useLocation();

  // Hide Navbar on login and register pages
  const hideNavbarPaths = ["/Login", "/register", "/expense-form"];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-w-[320px]">
      <Toaster position="top-right" />

      {/* Conditionally show Navbar */}
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App Pages */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/split" element={<Split />} />
        <Route path="/plan-goal" element={<PlanGoal />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transaction-form" element={<ExpenseForm />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/debit" element={<Debit />} />
        <Route path="/credit-form" element={<CreditForm />} />
        <Route path="/debit-form" element={<DebitForm />} />
        <Route path="/credit-archive" element={<CreditArchive />} />
        <Route path="/debit-archive" element={<DebitArchive />} />
        <Route path="/addgoal" element={<AddGoalForm />} />
        <Route path="/goal-analysis/:id" element={<GoalAnalysisPage />} />
        <Route path="/bills" element={<BillRemiander />} />
        <Route path="/add-bill" element={<AddBillForm />} />
        <Route path="/completedbills" element={<CompletedBillsArchive />} />
        <Route path="/addsplit" element={<AddSplitForm />} />
        <Route path="/completedsplits" element={<ArchivedSplits />} />
       
      </Routes>
    </div>
  );
};

export default App;
