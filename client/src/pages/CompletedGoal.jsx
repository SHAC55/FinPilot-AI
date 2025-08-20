import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import { CheckCircle, Calendar } from "lucide-react";

const CompletedGoal = () => {
  const { completeGoals, getCompletedGoals } = useContext(AppContext);

  useEffect(() => {
    getCompletedGoals(); // fetch once on mount
  }, [getCompletedGoals]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        ✅ Completed Goals
      </h2>

      {completeGoals.length === 0 ? (
        <p className="text-gray-500 italic">
          No completed goals yet. Keep going! 🚀
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completeGoals.map((goal) => (
            <div
              key={goal._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="text-green-500 w-6 h-6" />
                <h3 className="text-lg font-semibold text-gray-700">
                  {goal.goalName}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {goal.description || "No description"}
              </p>
              <div className="flex items-center text-gray-400 text-xs gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Completed on{" "}
                  {new Date(goal.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedGoal;
