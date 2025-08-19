import React, { useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/appContext";
import { FaRupeeSign, FaRegClock, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

const GetAllBills = () => {
  const { bills, setBills, deleteItem,  markBillsAsCompleted,URL } = useContext(AppContext);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${URL}/bill/get-bills`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setBills(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to fetch bills");
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    fetchBills();
  }, [setBills]);

  

  return (
  <div className="p-6 bg-gray-50 min-h-screen">
  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
    Your Bills
  </h2>

  {bills.length === 0 ? (
    <p className="text-gray-500 text-center text-lg mt-10">
      No bills found.
    </p>
  ) : (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bills.map((bill) => (
        <div
          key={bill._id}
          className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 p-6 border border-gray-100 flex flex-col justify-between"
        >
          {/* Bill Header */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {bill.billName}
          </h3>

          {/* Amount */}
          <div className="flex items-center text-gray-700 mb-2">
            <FaRupeeSign className="mr-2 text-green-500 text-lg" />
            <span className="font-bold text-lg">{bill.amount}</span>
          </div>

          {/* Frequency */}
          <div className="flex items-center text-gray-500 mb-2">
            <FaRegClock className="mr-2 text-gray-400" />
            <span className="capitalize">{bill.frequency}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center text-gray-500 mb-2">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            <span>
              {new Date(bill.deadline).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Reminder */}
          {bill.setReminder && bill.reminderDate && (
            <p className="mt-2 text-sm text-yellow-600 font-medium">
              Reminder:{" "}
              {new Date(bill.reminderDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}

          {/* Notes */}
          {bill.notes && (
            <p className="mt-3 text-gray-600 text-sm italic">{bill.notes}</p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => deleteItem("bill/delete-bill", bill._id, setBills)}
              className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
            >
              Delete
            </button>
            <button
              onClick={() => markBillsAsCompleted(bill._id)}
              className="flex-1 px-4 py-2 text-sm bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
            >
              Mark Completed
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default GetAllBills;
