import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import {
  Users,
  Wallet,
  UserCircle2,
  CheckCircle,
  Trash2,
  Bell,
  Save,
} from "lucide-react";
import { AppContext } from "../context/appContext";
import toast from "react-hot-toast";

const GetAllSplits = () => {
  const { deleteItem, splits, setSplits, URL, setCompletedSplits } =
    useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchAllSplits = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${URL}/split/allsplits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSplits(res.data.data || []);
        console.log(res.data.data);
      } catch (error) {
        console.error(
          "Error fetching splits:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllSplits();
  }, [URL, setSplits]);

  const sendReminder = async (splitId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${URL}/split/sendReminder/${splitId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reminder sent successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to send reminder");
    }
  };

  const handleInputChange = (splitId, userId, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [splitId]: {
        ...prev[splitId],
        [userId]: {
          ...prev[splitId]?.[userId],
          [field]: value,
        },
      },
    }));
  };

const saveParticipantUpdate = async (splitId, participant) => {
  try {
    const token = localStorage.getItem("token");

    const userId = participant.user?._id || participant._id;
    const { amountPaid, amountOwed } = editData[splitId]?.[userId] || {};

    const { data } = await axios.patch(
      `${URL}/split/updateAmounts/${splitId}`,
      {
        participantId: userId,
        amountPaid: amountPaid ?? participant.amountPaid,
        amountOwed: amountOwed ?? participant.amountOwed,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // console.log("Update success:", data);
    toast.success("Amounts updated & Reminder send successfully");
  } catch (err) {
    console.error("Error updating participant:", err.response?.data || err);
    toast.error("Failed to update participant");
  }
};


  const markSplitAsCompleted = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${URL}/split/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSplits((prev) => prev.filter((split) => split._id !== id));

        const completedRes = await axios.get(`${URL}/split/completedsplits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompletedSplits(completedRes.data);
      }
    } catch (error) {
      console.error("Error marking split as completed", error);
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading splits...</div>;

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
        💸 All Splits
      </h2>

      {splits.length === 0 ? (
        <p className="text-gray-500">No splits found</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {splits.map((split) => (
            <div
              key={split._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {split.title}
                  </h3>
                  <span className="flex items-center text-green-600 font-bold text-sm">
                    <Wallet size={18} className="mr-1" /> ₹{split.totalAmount}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Created by:{" "}
                  <span className="font-medium text-gray-700">
                    {split.createdBy.email}
                  </span>
                </p>

                {/* Participants */}
                <div className="bg-gray-50 p-3 rounded-xl">
                  <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Users size={16} className="mr-2" /> Participants
                  </h4>
                  <ul className="space-y-2">
                    {split.participants.map((p) => {
                      const userId = p.user?._id || p._id;
                      const userEdit = editData[split._id]?.[userId] || {};

                      return (
                        <li
                          key={`${split._id}-${userId}`}
                          className="flex justify-between items-center text-sm bg-white rounded-lg p-2 shadow-sm"
                        >
                          <div>
                            <span className="flex items-center">
                              <UserCircle2
                                size={18}
                                className="text-gray-500 mr-2"
                              />
                              {p.username || p.user?.username || "Unknown"}
                            </span>
                            <span className="flex items-center">
                              {p.email || p.user?.email || "Unknown"}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <div className="flex gap-2 text-xs text-gray-500">
                              Paid:
                              <input
                                type="number"
                                value={userEdit.amountPaid ?? p.amountPaid}
                                onChange={(e) =>
                                  handleInputChange(
                                    split._id,
                                    userId,
                                    "amountPaid",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 text-right border rounded px-1"
                              />
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500">
                              Owes:
                              <input
                                type="number"
                                value={userEdit.amountOwed ?? p.amountOwed}
                                onChange={(e) =>
                                  handleInputChange(
                                    split._id,
                                    userId,
                                    "amountOwed",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 text-right border rounded px-1"
                              />
                            </div>

                            <button
                              onClick={() => saveParticipantUpdate(split._id, p)}
                              className="flex items-center text-green-600 hover:text-green-800 text-xs font-medium mt-1"
                            >
                              <Save size={14} className="mr-1" /> Save & Notify
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <button
                  onClick={() =>
                    deleteItem("split/deletesplit", split._id, setSplits)
                  }
                  className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </button>

                <button
                  onClick={() => markSplitAsCompleted(split._id)}
                  className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  <CheckCircle size={16} className="mr-1" /> Completed
                </button>

                <button
                  onClick={() => sendReminder(split._id)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Bell size={16} className="mr-1" /> Send Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllSplits;
