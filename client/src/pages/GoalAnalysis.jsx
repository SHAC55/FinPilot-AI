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
        const res = await fetch(
          `http://localhost:5000/api/goal/analyze-goal/${id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        if (data.success) {
          try {
            // Try parsing analysis if it's a JSON string
            const parsed = typeof data.analysis === "string"
              ? JSON.parse(data.analysis)
              : data.analysis;
            setAnalysis(parsed);
          } catch (parseErr) {
            // If parsing fails, store as plain text
            setAnalysis({ summary: data.analysis });
          }
        } else {
          setError(data.message || "Failed to get AI analysis");
        }
      } catch (err) {
        setError("Server error. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const renderSection = (title, content) => (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-gray-700 whitespace-pre-line">{content}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Goal Analysis</h1>

      {loading && <p>Analyzing your goal with AI...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && analysis && (
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          {renderSection("Summary", analysis.summary)}
          {renderSection("Estimated Time", analysis.estimated_time)}
          {renderSection("Investment Plan", analysis.investment_plan)}
          {renderSection("Action Steps", Array.isArray(analysis.action_steps) 
            ? analysis.action_steps.map((step, i) => `${i + 1}. ${step}`).join("\n") 
            : analysis.action_steps)}
          {renderSection("Risks", analysis.risks)}
          {renderSection("Motivation", analysis.motivation)}
        </div>
      )}
    </div>
  );
};

export default GoalAnalysisPage;
