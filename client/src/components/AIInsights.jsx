import React from "react";
import { Brain, TrendingUp, Lightbulb, Target, ChevronRight } from "lucide-react";

const AIInsights = () => {
  const insights = [
    {
      icon: TrendingUp,
      message: "You spent 32% more on food this month. Try reducing dining expenses.",
      type: "warning",
      suggestion: "Set a $500 monthly food budget",
    },
    {
      icon: Lightbulb,
      message: "You could save $200/month by optimizing your grocery shopping.",
      type: "tip",
      suggestion: "Switch to store brands",
    },
    {
      icon: Target,
      message: "You're 45% towards your monthly savings goal. Keep it up!",
      type: "goal",
      suggestion: "+$450 saved this month",
    },
  ];

  return (
    <section className="py-16 px-6 bg-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-3">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">AI Advisor</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Your Personal{" "}
            <span className="text-blue-600">AI Financial Advisor</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            Analyzes your last 30 days of transactions and gives actionable insights
          </p>
        </div>

        {/* Insights Cards */}
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === "warning" ? "bg-orange-50" :
                    insight.type === "tip" ? "bg-blue-50" : "bg-green-50"
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      insight.type === "warning" ? "text-orange-500" :
                      insight.type === "tip" ? "text-blue-500" : "text-green-500"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">{insight.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{insight.suggestion}</span>
                      <button className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center gap-1">
                        Details
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">32%</div>
            <div className="text-xs text-gray-600">Food spending ↑</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">$200</div>
            <div className="text-xs text-gray-600">Potential savings</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-600">45%</div>
            <div className="text-xs text-gray-600">Goal progress</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIInsights;