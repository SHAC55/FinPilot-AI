import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api.js";
import { AppContext } from "../context/appContext";

const FEASIBILITY = {
  Easy:        { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  Moderate:    { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500"   },
  Challenging: { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-500"  },
  Aggressive:  { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",      dot: "bg-red-500"     },
};

const RISK_COLOR = {
  Low:    { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-400" },
  Medium: { bg: "bg-amber-50",   text: "text-amber-700",   bar: "bg-amber-400"   },
  High:   { bg: "bg-red-50",     text: "text-red-700",     bar: "bg-red-400"     },
};

const RISK_BAR_WIDTH = { Low: "33%", Medium: "66%", High: "100%" };

// ── Reusable small components ──────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.12em] mb-3">
    {children}
  </p>
);

const MetaCard = ({ label, value, mono = false }) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-semibold text-gray-800 ${mono ? "font-mono" : ""}`}>{value}</p>
  </div>
);

const SaveCard = ({ label, value }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
    <p className="text-base font-bold font-mono text-gray-900 leading-tight">{value}</p>
    <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">/ {label}</p>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────

const GoalAnalysis = () => {
  const { id } = useParams();
  const { goals } = useContext(AppContext);

  const [goal,     setGoal]     = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const found = goals.find((g) => g._id === id);
    if (found) setGoal(found);
  }, [id, goals]);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.post("/ai/goal", {
        currentAmount: goal.savedAmount,
        goalAmount:    goal.targetAmount,
        deadline:      goal.deadline,
      });
      const raw = res.data.analysis;
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      setAnalysis(data);
    } catch (err) {
      setError("Analysis failed — please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!goal) return <div className="p-6 text-gray-400">Loading goal…</div>;

  const progress = Math.min(
    Math.round((goal.savedAmount / goal.targetAmount) * 100), 100
  );

  const feas    = analysis?.analysis?.feasibility;
  const fStyle  = FEASIBILITY[feas] ?? FEASIBILITY.Moderate;
  const aiPct   = analysis?.analysis?.completionPercent ?? progress;

  return (
    <div className="p-5 max-w-2xl mx-auto font-sans space-y-4">

      {/* ── Header Card ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Financial Goal</p>
            <h1 className="text-xl font-bold text-gray-900">{goal.goalName}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Due {new Date(goal.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          {feas && (
            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${fStyle.bg} ${fStyle.text} ${fStyle.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${fStyle.dot}`} />
              {feas}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold">{aiPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-700"
              style={{ width: `${aiPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 mt-1.5">
            <span>₹{goal.savedAmount.toLocaleString("en-IN")} saved</span>
            <span>₹{goal.targetAmount.toLocaleString("en-IN")} target</span>
          </div>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <MetaCard label="Gap"         value={analysis?.analysis?.gap ?? "—"} mono />
          <MetaCard label="Months Left" value={analysis?.analysis?.monthsLeft ? `${analysis.analysis.monthsLeft} mo` : "—"} />
          <MetaCard label="Remaining"   value={`₹${(goal.targetAmount - goal.savedAmount).toLocaleString("en-IN")}`} mono />
        </div>
      </div>

      {/* ── Analyze Button ───────────────────────────────────── */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Analyzing…
          </span>
        ) : "Get AI Financial Analysis "}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ── Analysis Results ─────────────────────────────────── */}
      {analysis && (
        <div className="space-y-4">

          {/* Saving Plan */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <SectionLabel>Saving Plan</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              <SaveCard label="Month" value={analysis.savingPlan.monthly} />
              <SaveCard label="Week"  value={analysis.savingPlan.weekly}  />
              <SaveCard label="Day"   value={analysis.savingPlan.daily}   />
            </div>
          </div>

          {/* AI Summary */}
          <div className="rounded-2xl bg-blue-50 px-5 py-4">
            <p className="text-[10px] text-gray-800 uppercase tracking-widest mb-2">AI Insight</p>
            <p className="text-sm text-black font-semibold italic leading-relaxed">"{analysis.summary}"</p>
          </div>

          {/* Professional Tips */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <SectionLabel>Professional Advice</SectionLabel>
            <div className="space-y-3">
              {analysis.professionalTips.map(({ category, icon, title, tip }, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-green-50 border border-gray-100">
                  <div className="text-xl mt-0.5 shrink-0">{icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-800">{title}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-white bg-green-400 px-2 py-0.5 rounded-full">
                        {category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Instruments */}
          {analysis.instruments?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionLabel>Recommended Instruments</SectionLabel>
              <div className="space-y-2">
                {analysis.instruments.map(({ name, expectedReturn, risk, suitable }, i) => {
                  const rs = RISK_COLOR[risk] ?? RISK_COLOR.Medium;
                  return (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${suitable ? "bg-white border-gray-100" : "bg-gray-50 border-gray-100 opacity-50"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{name}</p>
                          <p className="text-xs text-gray-400">{expectedReturn}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-1 ${rs.bar} rounded-full`} style={{ width: RISK_BAR_WIDTH[risk] }} />
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rs.bg} ${rs.text}`}>
                          {risk}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Risk Flag */}
          {analysis.riskFlag && analysis.riskFlag !== "null" && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex gap-3 items-start">
              <span className="text-lg shrink-0 mt-0.5">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-800 mb-0.5">Risk Alert</p>
                <p className="text-sm text-red-600 leading-relaxed">{analysis.riskFlag}</p>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default GoalAnalysis;