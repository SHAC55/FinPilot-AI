import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllGoals = () => {
  const { goals, setGoals, deleteItem,URL,markGoalAsCompleted } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoalsFromAPI = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${URL}/goal/getallgoals`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setGoals(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching goals:", err);
      }
    };

    fetchGoalsFromAPI();
  }, [setGoals]);

  const handleAddFunds = async (id, amount) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${URL}/goal/addfund/${id}`,
        { amount }, // body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Update UI with new savedAmount
        setGoals((prev) =>
          prev.map((goal) =>
            goal._id === id
              ? { ...goal, savedAmount: res.data.data.savedAmount }
              : goal
          )
        );
        toast.success("Funds added successfully!");
      } else {
        toast.error(res.data.message || "Failed to add funds");
      }
    } catch (err) {
      console.error("Error adding funds:", err);
      toast.error("Server error while adding funds");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const progress = Math.min(
          ((goal.savedAmount / goal.targetAmount) * 100).toFixed(1),
          100
        );

        return (
          <div
            key={goal._id}
            className="bg-white rounded-2xl shadow-lg border p-5 flex flex-col"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-800">
                {goal.goalName}
              </h2>
              {goal.completed && (
                <span className="text-green-600 text-sm font-semibold">
                  ✔ Completed
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600">
              Saved: ₹{goal.savedAmount} / ₹{goal.targetAmount}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}% achieved</p>

            <p className="text-sm text-gray-500 mt-2">
              Deadline: {new Date(goal.deadline).toLocaleDateString()}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/goal-analysis/${goal._id}`)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                Analyze with AI
              </button>
              <button
                onClick={() => {
                  const amount = parseFloat(prompt("Enter amount to add:"));
                  if (!isNaN(amount) && amount > 0) {
                    handleAddFunds(goal._id, amount);
                  } else {
                    toast.error("Please enter a valid amount");
                  }
                }}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              >
                Add Funds
              </button>
              {!goal.completed && (
                <button
                  onClick={() => markGoalAsCompleted(goal._id)}
                  className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                >
                  Mark Completed
                </button>
              )}
              <button
                onClick={() =>
                  deleteItem("goal/delete-goal", goal._id, setGoals)
                }
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllGoals;
