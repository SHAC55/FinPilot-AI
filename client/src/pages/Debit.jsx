import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaArchive } from "react-icons/fa";
import { AppContext } from "../context/appContext";
import axios from "axios";
import dayjs from "dayjs";

const Debit = () => {
  const navigate = useNavigate();
  const { debit, setDebit, deleteItem, markDedbitAsCompleted } =
    useContext(AppContext);

  // Fetch debits from API
  useEffect(() => {
    const fetchDebits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/transaction/getalldebit",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDebit(res.data.data || []);
      } catch (error) {
        console.error("Error fetching debits:", error);
      }
    };
    fetchDebits();
  }, [setDebit]);

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          📒 My Debits
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/debit-form")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                       text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg 
                       hover:scale-105 transition duration-200"
          >
            <MdOutlinePlaylistAdd size={20} />
            Add Debit
          </button>
          <button
            onClick={() => navigate("/debit-archive")}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-400 
                       text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg 
                       hover:scale-105 transition duration-200"
          >
            <FaArchive size={18} />
            Archive
          </button>
        </div>
      </div>

      {/* Debit List */}
      {debit.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500 text-lg">No debits found 🚫</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {debit.map((c) => (
            <div
              key={c._id}
              className="bg-white/80 backdrop-blur-lg border border-gray-200 
                         rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] 
                         transition duration-200 p-6 flex flex-col justify-between"
            >
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 break-words">
                {c.title}
              </h3>

              {/* Info */}
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-gray-700">
                  💰 <span className="font-medium">Amount:</span> ₹{c.amount}
                </p>
                <p className="text-gray-700">
                  📅 <span className="font-medium">Deadline:</span>{" "}
                  {dayjs(c.deadline).format("DD MMM YYYY")}
                </p>
                {c.notes && (
                  <p className="text-gray-600 italic">📝 {c.notes}</p>
                )}
              </div>

              {/* Status */}
              <span
                className={`mt-4 inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  c.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {c.completed ? "✅ Completed" : "⏳ Pending"}
              </span>

              {/* Buttons */}
              <div className="flex gap-2 mt-5">
                {!c.completed && (
                  <button
                    onClick={() => markDedbitAsCompleted(c._id)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 
                               text-white py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 
                               transition-all duration-200"
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  onClick={() =>
                    deleteItem("transaction/delete-debit", c._id, setDebit)
                  }
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 
                             text-white py-2 rounded-lg hover:from-red-600 hover:to-pink-600 
                             transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Debit;
