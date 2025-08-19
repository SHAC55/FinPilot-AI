import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AppContext } from "../context/appContext";
import axios from "axios";
import dayjs from "dayjs";
import { FaArchive } from "react-icons/fa";
import { BsCheckCircleFill, BsHourglassSplit } from "react-icons/bs";

const Credit = () => {
  const navigate = useNavigate();
  const { credit, setCredit, deleteItem, markCreditAsCompleted,URL } =
    useContext(AppContext);

  // Fetch credits from API
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${URL}/transaction/getallcredit`,
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
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">📒 My Credits</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/credit-form")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow hover:shadow-lg transition duration-200"
          >
            <MdOutlinePlaylistAdd size={20} />
            Add Credit
          </button>
          <button
            onClick={() => navigate("/credit-archive")}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-400 text-white px-5 py-2.5 rounded-xl shadow hover:shadow-lg transition duration-200"
          >
            <FaArchive size={18} />
            Archive
          </button>
        </div>
      </div>

      {/* Credit List */}
      {credit.length === 0 ? (
        <p className="text-gray-500 text-lg mt-6 text-center">No credits found</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {credit.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between"
            >
              {/* Title */}
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 break-words">
                {c.title}
              </h3>

              {/* Info */}
              <div className="space-y-2 text-gray-700 text-sm">
                <p>
                  💰 <span className="font-medium">Amount:</span>{" "}
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{c.amount}
                  </span>
                </p>
                <p>
                  📅 <span className="font-medium">Deadline:</span>{" "}
                  {dayjs(c.deadline).format("DD MMM YYYY")}
                </p>
                {c.notes && (
                  <p className="text-gray-600 text-sm italic mt-2 break-words">
                    📝 {c.notes}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="mt-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full ${
                    c.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {c.completed ? (
                    <>
                      <BsCheckCircleFill size={14} /> Completed
                    </>
                  ) : (
                    <>
                      <BsHourglassSplit size={14} /> Pending
                    </>
                  )}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                {!c.completed && (
                  <button
                    onClick={() => markCreditAsCompleted(c._id)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl shadow hover:shadow-lg transition duration-200"
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  onClick={() =>
                    deleteItem("transaction/delete-credit", c._id, setCredit)
                  }
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white py-2.5 px-4 rounded-xl shadow hover:shadow-lg transition duration-200"
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
