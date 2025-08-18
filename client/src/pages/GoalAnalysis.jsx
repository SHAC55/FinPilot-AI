import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GoalAnalysisPage = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/goal/analyze-goal/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          const parsed = typeof data.analysis === "string" ? JSON.parse(data.analysis) : data.analysis;
          setAnalysis(parsed);
        } else {
          setError(data.message || "Failed to get AI analysis");
        }
      } catch(err) {
        console.log(err);
        
        setError("Server error. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Analyzing your goal with AI...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!analysis) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Goal Analysis</h1>

      {/* Monthly Saving & Inflation Adjusted Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-1">Required Monthly Saving</h3>
          <p className="text-gray-700">{analysis.monthlySaving}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-1">Inflation-Adjusted Target</h3>
          <p className="text-gray-700">₹{analysis.inflationAdjustedTarget.toLocaleString()}</p>
        </div>
      </div>

      {/* Investment Plan */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Investment Plan</h2>
        {analysis.investmentPlan.map((plan, i) => (
          <div key={i} className="mb-4 p-3 border rounded-md">
            <h3 className="font-semibold">{plan.risk} Risk</h3>
            <p><strong>Option:</strong> {plan.option}</p>
            <p><strong>Expected Return:</strong> {plan.expectedReturn}</p>
            <p><strong>Estimated Total Value:</strong> {plan.estimatedTotalValue}</p>
            <p><strong>Pros:</strong> {plan.pros.join(", ")}</p>
            <p><strong>Cons:</strong> {plan.cons.join(", ")}</p>
            <p><strong>Tax Implications:</strong> {plan.taxImplications}</p>
          </div>
        ))}
      </div>

      {/* Key Risks */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Key Risks</h2>
        <ul className="list-disc pl-5 text-gray-700">
          {analysis.keyRisks.map((risk, i) => <li key={i}>{risk}</li>)}
        </ul>
      </div>

      {/* Priority Actions */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Priority Actions (Next 3 Months)</h2>
        <ol className="list-decimal pl-5 text-gray-700">
          {analysis.priorityActionsNext3Months.map((action, i) => <li key={i}>{action}</li>)}
        </ol>
      </div>

      {/* Suggested Financial Tools */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Suggested Financial Tools</h2>
        <ul className="list-disc pl-5 text-gray-700">
          {analysis.suggestedFinancialTools.map((tool, i) => <li key={i}>{tool}</li>)}
        </ul>
      </div>

      {/* Final Tip */}
      {analysis.finalTip && (
        <div className="bg-yellow-100 p-5 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Final Tip</h2>
          <p className="text-gray-800">{analysis.finalTip}</p>
        </div>
      )}
    </div>
  );
};

export default GoalAnalysisPage;
