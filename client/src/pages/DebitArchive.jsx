
import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

const DebitArchive = () => {
  const { archiveDebit, getCompletedDebit} = useContext(AppContext);

  const navigate  = useNavigate()

  useEffect(() => {
    getCompletedDebit();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex items-center justify-between border-b pb-3 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          📒 Debit Archive
        </h2>
        <button
          onClick={() => navigate("/debit")}
          className="px-4 py-2  border rounded-lg shadow-sm hover:bg-blue-700 transition duration-200"
        >
          Back
        </button>
      </div>

      {archiveDebit?.length === 0 ? (
        <p className="text-gray-500 italic">No completed credits found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {archiveDebit.map((debit) => (
            <div
              key={debit._id}
              className="bg-yellow-50 border-l-4 border-yellow-400 shadow-md rounded-lg p-4 relative overflow-hidden transform transition hover:scale-[1.02] hover:shadow-lg"
            >
              {/* Decorative pin */}
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full shadow-sm"></span>

              <p className="font-semibold text-lg text-gray-800">
                {debit.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                💰 Amount:{" "}
                <span className="font-medium text-green-600">
                  {debit.amount}
                </span>
              </p>
              <p className="mt-3 text-xs font-medium text-green-700 bg-green-100 inline-block px-2 py-1 rounded">
                ✅ Completed
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebitArchive;
