import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AppContext } from "../context/appContext";
import axios from "axios";
import dayjs from "dayjs";
import { FaArchive } from "react-icons/fa";

const Credit = () => {
  const navigate = useNavigate();
  const { credit, setCredit, deleteItem, markCreditAsCompleted } =
    useContext(AppContext);

  // Fetch credits from API
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/transaction/getallcredit",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCredit(res.data.data || []);
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    };
    fetchCredits();
  }, [setCredit]);


  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📒 My Credits</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/credit-form")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
          >
            <MdOutlinePlaylistAdd size={20} />
            Add Credit
          </button>
          <button
            onClick={() => navigate("/credit-archive")}
            className="flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-500 transition duration-200"
          >
            <FaArchive size={18} />
            Archive
          </button>
        </div>
      </div>

      {/* Credit List */}
      {credit.length === 0 ? (
        <p className="text-gray-500 text-lg mt-4">No credits found</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {credit.map((c) => (
            <div
              key={c._id}
              className="border rounded-xl hover:shadow-lg transition duration-200 p-5 flex flex-col justify-between"
            >
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 break-words">
                {c.title}
              </h3>

              {/* Info */}
              <div className="mt-2 space-y-1">
                <p className="text-gray-700 text-sm">
                  💰 <span className="font-medium">Amount:</span> ₹{c.amount}
                </p>
                <p className="text-gray-700 text-sm">
                  📅{" "}
                  <span className="font-medium">Deadline:</span>{" "}
                  {dayjs(c.deadline).format("DD MMM YYYY")}
                </p>
                {c.notes && (
                  <p className="text-gray-600 text-sm break-words mt-2">
                    📝 {c.notes}
                  </p>
                )}
              </div>

              {/* Status */}
              <span
                className={`mt-4 self-start px-3 py-1 text-xs font-medium rounded-full ${
                  c.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {c.completed ? "Completed" : "Pending"}
              </span>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                {!c.completed && (
                  <button
                    onClick={() => markCreditAsCompleted(c._id)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  onClick={() =>
                    deleteItem("transaction/delete-credit", c._id, setCredit)
                  }
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
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

export default Credit;
