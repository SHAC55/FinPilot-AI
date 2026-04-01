import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import PlanGoal from "./pages/PlanGoal";
import ExpenseForm from "./pages/ExpenseForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddGoalForm from "./pages/AddGoalForm";
import GoalAnalysisPage from "./pages/GoalAnalysis";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Transaction from "./pages/Transaction";
import Wallet from "./pages/Wallet";
import AddWalletForm from "./pages/AddWalletForm";
import WalletDetails from "./pages/WalletDetail";
import Ledger from "./pages/Ledger";
import AddLedger from "./pages/AddLedger";
import AiInsightExpense from "./pages/AiInsightExpense";
import LandingPage from "./pages/LandingPage";
import CreateSplitBill from "./pages/CreateSplitBill";
import SplitBills from "./pages/SplitBills";
import ForgotPassword from "./pages/ForgotPassword";
import ResestPassword from "./pages/ResestPassword";


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
    "/profile",
    "/addwallet",
    "/addtransaction",
    "/ledger/add",
    "/goal-analysis/:id",
    "/",
    "/split-bills/create",
    "/forgot-password",
    "/reset-password"
  ];

  const shouldHideNavbar =
  hideNavbarPaths.includes(location.pathname) ||
  location.pathname.startsWith("/reset-password/");

  return (
    <div className="min-w-[320px]">
      <Toaster position="top-right" />

      {/* Conditionally show Navbar */}
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResestPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <PrivateRoute>
              <Transaction />
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
          path="/wallet"
          element={
            <PrivateRoute>
              <Wallet />
            </PrivateRoute>
          }
        />
        <Route
          path="/addwallet"
          element={
            <PrivateRoute>
              <AddWalletForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/:id"
          element={
            <PrivateRoute>
              <WalletDetails />
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
          path="/addtransaction"
          element={
            <PrivateRoute>
              <ExpenseForm />
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
          path="/ledger"
          element={
            <PrivateRoute>
              <Ledger />
            </PrivateRoute>
          }
        />
        <Route
          path="/ledger/add"
          element={
            <PrivateRoute>
              <AddLedger />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-insight-expense"
          element={
            <PrivateRoute>
              <AiInsightExpense />
            </PrivateRoute>
          }
        />

        <Route
          path="/split-bills"
          element={
            <PrivateRoute>
              <SplitBills />
            </PrivateRoute>
          }
        />

       
        
        <Route
          path="/split-bills/create"
          element={
            <PrivateRoute>
              <CreateSplitBill />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
