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
import ArchivedSplits from "./pages/ArchivedSplits";
import { useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // Hide Navbar on login and register pages
  const hideNavbarPaths = [
    "/Login",
    "/register",
    "/login",
    "/Register",
    "/expense-form",
  ];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-w-[320px]">
      <Toaster position="top-right" />

      {/* Conditionally show Navbar */}
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <PrivateRoute>
              <Expense />
            </PrivateRoute>
          }
        />
        <Route
          path="/split"
          element={
            <PrivateRoute>
              <Split />
            </PrivateRoute>
          }
        />
        <Route
          path="/plan-goal"
          element={
            <PrivateRoute>
              <PlanGoal />
            </PrivateRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <PrivateRoute>
              <Archive />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction-form"
          element={
            <PrivateRoute>
              <ExpenseForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/credit"
          element={
            <PrivateRoute>
              <Credit />
            </PrivateRoute>
          }
        />
        <Route
          path="/debit"
          element={
            <PrivateRoute>
              <Debit />
            </PrivateRoute>
          }
        />
        <Route
          path="/credit-form"
          element={
            <PrivateRoute>
              <CreditForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/debit-form"
          element={
            <PrivateRoute>
              <DebitForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/credit-archive"
          element={
            <PrivateRoute>
              <CreditArchive />
            </PrivateRoute>
          }
        />
        <Route
          path="/debit-archive"
          element={
            <PrivateRoute>
              <DebitArchive />
            </PrivateRoute>
          }
        />
        <Route
          path="/addgoal"
          element={
            <PrivateRoute>
              <AddGoalForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/goal-analysis/:id"
          element={
            <PrivateRoute>
              <GoalAnalysisPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bills"
          element={
            <PrivateRoute>
              <BillRemiander />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-bill"
          element={
            <PrivateRoute>
              <AddBillForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/completedbills"
          element={
            <PrivateRoute>
              <CompletedBillsArchive />
            </PrivateRoute>
          }
        />
        <Route
          path="/addsplit"
          element={
            <PrivateRoute>
              <AddSplitForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/completedsplits"
          element={
            <PrivateRoute>
              <ArchivedSplits />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
