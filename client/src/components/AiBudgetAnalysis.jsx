  import React, { useEffect, useState } from "react";
  import { Lightbulb, RefreshCw } from "lucide-react";
  import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/appContext";

  const AiBudgetAnalysis = () => {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const{ URL } =  useContext(AppContext)

    const fetchInsight = async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const url = forceRefresh
          ? `${URL}/finance/finance-analysis?refresh=true`
          : `${URL}/finance/finance-analysis`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.analysis) {
          setInsight(res.data.analysis);
        } else {
          setError("No analysis available");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("No transactions found for analysis");
        } else {
          setError("Error fetching analysis");
        }
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchInsight();
    }, []);

    if (loading) return <p className="text-gray-600  mt-5">Analyzing your expenses...</p>;
    if (error) return <p className="text-red-600 bg-red-100 rounded-2xl mt-10 ml-5 border p-3 border-gray-200 hover:shadow-xl transition-shadow duration-300">{error}</p>;
    if (!insight) return null;

    return (
      <div className="w-full mt-7 h-[555px] bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">AI Budget Analysis</h2>
          </div>
          <button
            onClick={() => fetchInsight(true)}
            className="flex items-center gap-1 text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Spending Trend */}
        {insight.spendingTrend && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium text-gray-700">Spending Trend</h3>
            <p className="text-gray-600 text-sm">{insight.spendingTrend}</p>
          </div>
        )}

        {/* Saving Opportunities */}
        {insight.savingOpportunities?.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-700">Saving Opportunities</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm">
              {insight.savingOpportunities.map((op, idx) => (
                <li key={idx}>{op}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Top Categories */}
        {insight.topCategories?.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="font-medium text-green-700">Top Categories</h3>
            <ul className="text-gray-600 text-sm">
              {insight.topCategories.map((cat, idx) => (
                <li key={idx}>
                  {cat.category}: ₹{cat.totalSpent.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Final Tip */}
        {insight.finalTip && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-medium text-purple-700">Final Tip</h3>
            <p className="text-gray-600 text-sm">{insight.finalTip}</p>
          </div>
        )}
      </div>
    );
  };

  export default AiBudgetAnalysis;



/*
Medical: ₹11,765
Rent: ₹11,100
Food: ₹4,722
Transport: ₹5,012
Entertainment: ₹2,977

Medical: ₹11,765
Rent: ₹11,100
Food: ₹4,722
Transport: ₹5,012
Entertainment: ₹2,977

Medical: ₹11,765
Rent: ₹11,100
Food: ₹4,722
Transport: ₹5,012
Entertainment: ₹2,977

*/
