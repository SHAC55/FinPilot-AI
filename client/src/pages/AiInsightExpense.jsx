import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api";

// ── Design tokens ──────────────────────────────────────────────────────────

const STATUS = {
  Healthy:      { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500", border: "border-emerald-200" },
  Moderate:     { bg: "bg-amber-50",   text: "text-amber-700",   bar: "bg-amber-400",   border: "border-amber-200"  },
  Overspending: { bg: "bg-orange-50",  text: "text-orange-700",  bar: "bg-orange-500",  border: "border-orange-200" },
  Critical:     { bg: "bg-red-50",     text: "text-red-700",     bar: "bg-red-500",     border: "border-red-200"    },
};

const getScoreStyle = (s) => {
  if (s >= 80) return { ring: "#22c55e", tag: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (s >= 60) return { ring: "#3b82f6", tag: "bg-blue-50 text-blue-700 border-blue-200"          };
  if (s >= 40) return { ring: "#f59e0b", tag: "bg-amber-50 text-amber-700 border-amber-200"       };
  return             { ring: "#ef4444", tag: "bg-red-50 text-red-700 border-red-200"              };
};

// ── Atoms ──────────────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[.12em] mb-4">
    {children}
  </p>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${className}`}>
    {children}
  </div>
);

const MetaCell = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-900 font-mono">{value}</p>
  </div>
);

const ScoreRing = ({ score }) => {
  const r      = 40;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const sc     = getScoreStyle(score);
  return (
    <svg width="96" height="96" viewBox="0 0 100 100" className="shrink-0">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={sc.ring} strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset .8s ease" }}
      />
      <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0f172a">{score}</text>
      <text x="50" y="61" textAnchor="middle" fontSize="9"  fill="#94a3b8">/ 100</text>
    </svg>
  );
};

// ── Skeleton loader ────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="space-y-3.5 animate-pulse">
    {[80, 48, 120, 96, 120].map((h, i) => (
      <div key={i} className="bg-slate-100 rounded-2xl" style={{ height: h }} />
    ))}
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────

const AiInsightExpense = () => {
  const location = useLocation();
  const expenses = location.state?.expenses || [];

  const [analysis, setAnalysis] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!expenses.length) {
      setLoading(false);
      return;
    }

    const analyze = async () => {
      try {
        const cleanExpenses = expenses.map((e) => ({
          amount:   e.amount,
          category: e.category,
          type:     e.type,
        }));

        const res  = await API.post("/ai/analyze-expenses", { expenses: cleanExpenses });
        const raw  = res.data.analysis;
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        setAnalysis(data);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze expenses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, []);

  const sc = analysis ? getScoreStyle(analysis.scorecard.score) : null;

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!loading && !expenses.length) return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-slate-700 font-semibold">No expense data found</p>
        <p className="text-slate-400 text-sm mt-1">Go back and select expenses to analyze</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8faff] px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-3.5 font-sans">

        {/* Page header */}
        <div className="mb-1">
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Expense Insights</h1>
          <p className="text-sm text-slate-400 mt-0.5">AI-powered spending analysis · {expenses.length} transactions</p>
        </div>

        {/* ── Loading skeleton ───────────────────────────────────── */}
        {loading && <Skeleton />}

        {/* ── Error state ─────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-medium flex gap-2 items-center">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────── */}
        {analysis && (
          <>

            {/* Overview + Score */}
            <Card>
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
                    {analysis.overview.totalSpent}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Top category: <span className="text-slate-600 font-semibold">{analysis.overview.topCategory}</span>
                  </p>
                </div>
                <ScoreRing score={analysis.scorecard.score} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MetaCell label="Wasted"    value={analysis.overview.wastedAmount}       />
                <MetaCell label="Can Save"  value={analysis.overview.savingsOpportunity} />
                <MetaCell label="Health"    value={analysis.scorecard.label}             />
              </div>
            </Card>

            {/* AI Financial Advice — dark card */}
            <div className="bg-blue-700 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                <p className="text-[15px] font-bold text-white  uppercase tracking-widest">
                  AI Summary
                </p>
              </div>
              <p className="text-sm text-slate-200 italic leading-relaxed">
                "{analysis.financialAdvice.summary}"
              </p>
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide bg-blue-950 px-2 py-1 rounded-lg shrink-0">
                    Rule
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed pt-0.5">
                    {analysis.financialAdvice.rule}
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide bg-amber-950 px-2 py-1 rounded-lg shrink-0">
                    #1 Action
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed pt-0.5">
                    {analysis.financialAdvice.priority}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <Card>
              <SectionLabel>Category Breakdown</SectionLabel>
              <div className="space-y-4">
                {analysis.categoryBreakdown.map(({ category, amount, percentOfTotal, status, benchmark }) => {
                  const st = STATUS[status] ?? STATUS.Moderate;
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1.5 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{category}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${st.bg} ${st.text} ${st.border}`}>
                            {status}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-slate-900 font-mono">{amount}</p>
                          <p className="text-[10px] text-slate-400">{percentOfTotal}%</p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${st.bar} transition-all duration-700`}
                          style={{ width: `${percentOfTotal}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Benchmark: {benchmark}</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Overspending Areas */}
            {analysis.overspendingAreas?.length > 0 && (
              <Card>
                <SectionLabel>Overspending Areas</SectionLabel>
                <div className="space-y-2.5">
                  {analysis.overspendingAreas.map(({ category, issue, impact, fix }, i) => (
                    <div key={i} className="p-4 rounded-xl bg-red-50 border border-red-100">
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <p className="text-sm font-bold text-red-800">{category}</p>
                        <span className="text-xs font-bold text-red-600 font-mono bg-white border border-red-200 px-2 py-0.5 rounded-full shrink-0">
                          -{impact}/mo
                        </span>
                      </div>
                      <p className="text-sm text-red-600 leading-relaxed mb-2.5">{issue}</p>
                      <div className="flex gap-2 items-start bg-white rounded-lg p-2.5 border border-emerald-100">
                        <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-emerald-700 font-medium leading-relaxed">{fix}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Saving Tips */}
            <Card>
              <SectionLabel>Saving Tips</SectionLabel>
              <div className="space-y-2.5">
                {analysis.savingTips.map(({ icon, title, tip, monthlySaving }, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-900">{title}</p>
                        <span className="text-xs font-bold text-emerald-700 font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                          Save {monthlySaving}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Financial Scorecard */}
            <Card className="mb-6">
              <SectionLabel>Financial Scorecard</SectionLabel>
              <div className="flex items-center gap-5">
                <ScoreRing score={analysis.scorecard.score} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <p className="text-lg font-bold text-slate-900">
                      {analysis.scorecard.label}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.tag}`}>
                      {analysis.scorecard.score} / 100
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {analysis.scorecard.note}
                  </p>
                </div>
              </div>
            </Card>

          </>
        )}
      </div>
    </div>
  );
};

export default AiInsightExpense;