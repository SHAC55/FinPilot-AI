import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Target,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Trash2,
  CalendarDays,
  TrendingUp,
  X,
  IndianRupee,
  Wallet,
} from "lucide-react";

const daysLeft = (deadline) => {
  const diff = new Date(deadline) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Subtle accent colors — blue is primary, others complement
const ACCENTS = [
  { from: "from-blue-500",    to: "to-blue-600",    light: "bg-blue-50",    text: "text-blue-600",    bar: "bg-blue-500"    },
  { from: "from-slate-600",   to: "to-slate-700",   light: "bg-slate-100",  text: "text-slate-600",   bar: "bg-slate-500"   },
  { from: "from-cyan-500",    to: "to-cyan-600",    light: "bg-cyan-50",    text: "text-cyan-600",    bar: "bg-cyan-500"    },
  { from: "from-indigo-500",  to: "to-indigo-600",  light: "bg-indigo-50",  text: "text-indigo-600",  bar: "bg-indigo-500"  },
  { from: "from-teal-500",    to: "to-teal-600",    light: "bg-teal-50",    text: "text-teal-600",    bar: "bg-teal-500"    },
  { from: "from-sky-500",     to: "to-sky-600",     light: "bg-sky-50",     text: "text-sky-600",     bar: "bg-sky-500"     },
];

// ── Add Funds Modal ──────────────────────────────────────────────────────────
const AddFundsModal = ({ goal, onClose, onConfirm }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const parsed = parseFloat(amount);
    if (!isNaN(parsed) && parsed > 0) {
      onConfirm(goal._id, parsed);
      onClose();
    } else {
      toast.error("Please enter a valid amount");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Modal top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Wallet size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Add Funds</h3>
                <p className="text-xs text-gray-400 mt-0.5 max-w-[180px] truncate">
                  {goal.goalName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
            >
              <X size={15} />
            </button>
          </div>

          <div className="relative mb-5">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <IndianRupee size={15} />
            </span>
            <input
              autoFocus
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter amount"
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 font-semibold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            />
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm"
            >
              Add Funds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const AllGoals = () => {
  const { goals, setGoals, deleteItem, URL } = useContext(AppContext);
  const navigate = useNavigate();
  const [fundTarget, setFundTarget] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${URL}/goal/getallgoals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setGoals(res.data.data);
      } catch (err) {
        console.error("Error fetching goals:", err);
      }
    };
    fetchGoals();
  }, [setGoals]);

  const handleAddFunds = async (id, amount) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${URL}/goal/addfund/${id}`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setGoals((prev) =>
          prev.map((g) =>
            g._id === id ? { ...g, savedAmount: res.data.data.savedAmount } : g
          )
        );
        toast.success("Funds added successfully!");
      } else {
        toast.error(res.data.message || "Failed to add funds");
      }
    } catch {
      toast.error("Server error while adding funds");
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${URL}/goal/complete/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals((prev) =>
        prev.map((g) => g._id === id ? { ...g, completed: true } : g)
      );
      toast.success("Goal marked as completed!");
    } catch {
      toast.error("Failed to mark goal as completed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      {fundTarget && (
        <AddFundsModal
          goal={fundTarget}
          onClose={() => setFundTarget(null)}
          onConfirm={handleAddFunds}
        />
      )}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Savings Goals
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {goals.length} active goal{goals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
          <Target size={15} className="text-blue-600" />
          <span className="text-xs font-semibold text-gray-600">
            {goals.filter((g) => g.completed).length} / {goals.length} completed
          </span>
        </div>
      </div>

      {/* ── Empty State ─────────────────────────────────────────────────── */}
      {goals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <Target size={26} className="text-white" />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">No goals yet</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Set a savings target and start tracking your progress toward it.
          </p>
        </div>
      )}

      {/* ── Cards Grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {goals.map((goal, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          const progress = Math.min(
            parseFloat(((goal.savedAmount / goal.targetAmount) * 100).toFixed(1)),
            100
          );
          const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
          const days = daysLeft(goal.deadline);
          const isUrgent = days <= 7 && !goal.completed;

          return (
            <div
              key={goal._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Thin top accent */}
              <div className={`h-[3px] bg-gradient-to-r ${accent.from} ${accent.to}`} />

              <div className="p-5 flex flex-col gap-4 flex-1">

                {/* ── Card Top ──────────────────────────────────────────── */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${accent.light} ${accent.text} flex items-center justify-center font-bold text-base flex-shrink-0`}>
                    {goal.goalName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-gray-900 truncate leading-tight">
                      {goal.goalName}
                    </h2>
                    <div className="mt-1">
                      {goal.completed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={10} /> Completed
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isUrgent ? "text-red-600 bg-red-50" : "text-gray-500 bg-gray-100"
                        }`}>
                          <CalendarDays size={10} />
                          {days === 0 ? "Due today!" : `${days}d left`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Amount Stats ───────────────────────────────────────── */}
                <div className="grid grid-cols-3 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <div className="flex flex-col items-center py-2.5 px-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Saved</span>
                    <span className="text-xs font-bold text-emerald-600">
                      ₹{goal.savedAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center py-2.5 px-1 border-x border-gray-100">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Target</span>
                    <span className="text-xs font-bold text-gray-700">
                      ₹{goal.targetAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center py-2.5 px-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Left</span>
                    <span className="text-xs font-bold text-orange-500">
                      ₹{remaining.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* ── Progress ───────────────────────────────────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                      <TrendingUp size={11} />
                      Progress
                    </span>
                    <span className={`text-[11px] font-bold ${accent.text}`}>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${accent.bar}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* ── Deadline ───────────────────────────────────────────── */}
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <CalendarDays size={11} />
                  <span>
                    {new Date(goal.deadline).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>

                {/* ── Actions ────────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-2 pt-1 mt-auto border-t border-gray-50">
                  {/* Primary */}
                  <button
                    onClick={() => navigate(`/goal-analysis/${goal._id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition"
                  >
                    <Sparkles size={12} />
                    AI Analyze
                  </button>

                  {/* Secondary */}
                  <button
                    onClick={() => setFundTarget(goal)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 text-[11px] font-bold transition"
                  >
                    <PlusCircle size={12} />
                    Add Funds
                  </button>

                  {!goal.completed && (
                    <button
                      onClick={() => handleMarkCompleted(goal._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 text-[11px] font-bold transition"
                    >
                      <CheckCircle2 size={12} />
                      Complete
                    </button>
                  )}

                  {/* Delete — pushed right */}
                  <button
                    onClick={() => deleteItem("goal/delete-goal", goal._id, setGoals)}
                    className="ml-auto w-7 h-7 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                    title="Delete goal"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllGoals;