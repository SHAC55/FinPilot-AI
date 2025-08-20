import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import { CheckCircle, Users, Calendar } from "lucide-react";

const CompletedSplits = () => {
  const { getCompletedSplits, completedSplits } = useContext(AppContext);

  useEffect(() => {
  getCompletedSplits();
}, []); // run only once when component mounts

  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        ✅ Completed Splits
      </h2>

      {completedSplits.length === 0 ? (
        <p className="text-gray-500 italic">
          No completed splits yet. Keep tracking your expenses! 💰
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedSplits.map((split) => (
            <div
              key={split._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100"
            >
              {/* Title */}
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="text-green-500 w-6 h-6" />
                <h3 className="text-lg font-semibold text-gray-700">
                  {split.title}
                </h3>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>
                  {split.participants?.length} participants
                </span>
              </div>

              {/* Amount */}
              <p className="text-gray-700 font-medium mb-2">
                Total Amount: ₹{split.totalAmount}
              </p>

              {/* Completed date */}
              <div className="flex items-center text-gray-400 text-xs gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Completed on{" "}
                  {new Date(split.updatedAt).toLocaleDateString("en-IN", {
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

export default CompletedSplits;
