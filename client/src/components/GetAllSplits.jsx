import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Users,
  Wallet,
  UserCircle2,
  CheckCircle,
  Trash2,
  Bell,
  Save,
} from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/appContext";
import toast from "react-hot-toast";

const GetAllSplits = () => {
  const { deleteItem,splits,setSplits,completedSplits,setCompletedSplits } = useContext(AppContext);

  
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({}); 

  useEffect(() => {
    const fetchAllSplits = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:5000/api/split/allsplits",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
  }, []);

  const sendReminder = async (splitId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/split/sendReminder/${splitId}`,
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
      ...prev, // keep all existing splits as they are
      [splitId]: { // only update this particular split
        ...prev[splitId], // keep all existing users in this split as they are
        [userId]: { // only update this particular user
          ...prev[splitId]?.[userId],  // keep existing fields of the user
          [field]: value,  // update the specific field with the new value
        },
      },
    }));
  };

  const saveParticipantUpdate = async (splitId, userId) => {
    const token = localStorage.getItem("token");
    const updatedParticipant = editData[splitId]?.[userId];

    if (!updatedParticipant) return;

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/split/updateAmounts/${splitId}`,
        { participants: [{ userId, ...updatedParticipant }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Participant updated and email sent!");
      setSplits((prev) =>
        prev.map((s) => (s._id === splitId ? res.data.split : s))
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update participant");
    }
  };

 const markSplitAsCompleted = async (id) => {
  try {
    const  token =  localStorage.getItem("token")
    const res = await axios.patch(`http://localhost:5000/api/split/${id}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.data.success) {
      // Remove from active splits
      setSplits((prev) => prev.filter((split) => split._id !== id));
      // Refetch completed splits from backend to sync state
      const completedRes = await axios.get("/api/split/completedsplits", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
    <div className="p-6 space-y-6">
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
                      const userEdit = editData[split._id]?.[p.user._id] || {};
                      return (
                        <li
                           key={`${split._id}-${p.user?._id || p.email}`}
                          className="flex justify-between items-center text-sm bg-white rounded-lg p-2 shadow-sm"
                        >
                          <div>
                            <span className="flex items-center">
                              <UserCircle2
                                size={18}
                                className="text-gray-500 mr-2"
                              />
                              {p.username || "Unknown"}
                            </span>
                            <span className="flex items-center">
                              {/* <UserCircle2 size={18} className="text-gray-500 mr-2" /> */}
                              {p.email || "Unknown"}
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
                                    p.user._id,
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
                                    p.user._id,
                                    "amountOwed",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 text-right border rounded px-1"
                              />
                            </div>
                            <button
                              onClick={() =>
                                saveParticipantUpdate(split._id, p.user._id)
                              }
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
                {/* <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                  <Pencil size={16} className="mr-1" /> Update
                </button> */}

                <button
                  onClick={() =>
                    deleteItem("split/deletesplit", split._id, setSplits)
                  }
                  className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </button>

                <button
                onClick={() =>  markSplitAsCompleted(split._id)}
                className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium">
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
