import React, { useEffect, useState } from "react";
import { Lightbulb, TrendingUp } from "lucide-react";
import axios from "axios";

const AiBudgetAnalysis = () => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/finance/finance-analysis",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data.data;
        if (res.data.success) {
          setInsight(JSON.stringify(res.data.analysis, null, 2)); // pretty-print JSON
        } else {
          setError(res.data.message || "Failed to fetch analysis");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          AI Budget Analysis
        </h2>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">
        {loading
          ? "Analyzing your expenses..."
          : error
          ? error
          : insight || "No insights yet"}
      </p>

      {!loading && !error && (
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="text-green-700 text-sm font-medium">{insight}</span>
        </div>
      )}
    </div>
  );
};

export default AiBudgetAnalysis;
