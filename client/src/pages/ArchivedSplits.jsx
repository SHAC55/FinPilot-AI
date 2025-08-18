import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import axios from "axios";

const ArchivedSplits = () => {
  const { completedSplits, setCompletedSplits } = useContext(AppContext);

  useEffect(() => {
    try {
      const fetchCompletedSplits = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/split/completedsplits",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCompletedSplits(res.data); // all completed splits
      };
      fetchCompletedSplits();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Archived Splits</h1>

      {completedSplits.length === 0 ? (
        <p className="text-gray-600">No completed splits found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedSplits.map((split) => (
            <div
              key={split._id}
              className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {split.title}
              </h2>
              <p className="text-gray-600 mb-1">
                Total Amount:{" "}
                <span className="font-medium">₹{split.totalAmount}</span>
              </p>
              <p className="text-gray-600 mb-3">
                Participants:{" "}
                <span className="font-medium">
                  {split.participants?.length}
                </span>
              </p>
              <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                Completed
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivedSplits;
