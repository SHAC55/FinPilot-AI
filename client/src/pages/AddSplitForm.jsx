import React, { useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Search } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/appContext";
import toast from "react-hot-toast";

const AddSplitForm = ({  }) => {
  const { searchUser, setSearchUser } = useContext(AppContext);

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      totalAmount: "",
      participants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (timeoutId) clearTimeout(timeoutId);

    setTimeoutId(
      setTimeout(async () => {
        if (value.trim().length > 2) {
          const token = localStorage.getItem("token");
          if (!token) return;
          try {
            const res = await axios.get(
              `http://localhost:5000/api/auth/searchuser?email=${value}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setSearchUser(res.data.data || []);
          } catch (err) {
            console.error("Error fetching users:", err);
            setSearchUser([]);
          }
        } else {
          setSearchUser([]);
        }
      }, 500)
    );
  };

  // Add participant
  const addParticipant = (user) => {
    if (!fields.find((f) => f.userId === user._id)) {
      append({
        name: user.name || user.username || "Unnamed",
        email: user.email || "",
        userId: user._id,
        amountPaid: 0,
        amountOwed: 0,
      });
    }
    setSearchQuery("");
    setSearchUser([]);
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: data.title,
        totalAmount: Number(data.totalAmount),
        notes: data.note,
        participants: data.participants.map((p) => ({
          username: p.name, // map form name → backend username
          email: p.email,
          amountPaid: Number(p.amountPaid),
          amountOwed: Number(p.amountOwed),
          user: p.userId || null, // optional reference
        })),
      };

      const res = await axios.post(
        "http://localhost:5000/api/split/add-split",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Split added successfully");
      reset();
      console.log(res.data.data);
    } catch (error) {
      console.error("❌ Error in add-split:", error.response?.data || error.message);
      toast.error("Failed to create split");
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-50 shadow-lg rounded-2xl p-6 space-y-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Create Split</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            {...register("title", { required: true })}
            placeholder="e.g., Trip to Goa"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Total Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount
          </label>
          <input
            type="number"
            {...register("totalAmount", { required: true })}
            placeholder="Enter total amount"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <textarea
            {...register("note")}
            placeholder="Enter note"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* User Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Participants
          </label>
          <div className="flex items-center border rounded-lg w-full px-3">
            <Search className="text-gray-500 mr-2" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search user by email"
              className="flex-1 py-2 outline-none"
            />
          </div>

          {searchUser.length > 0 && (
            <ul className="mt-2 border rounded-lg max-h-40 overflow-auto">
              {searchUser.map((user) => (
                <li
                  key={user._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => addParticipant(user)}
                >
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Participants List */}
        {fields.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Participants</h3>
            {fields.map((participant, index) => (
              <div
                key={participant.id}
                className="flex gap-2 items-center justify-between border rounded-lg p-3 bg-gray-50"
              >
                {/* Hidden fields for submission */}
                <input
                  type="hidden"
                  {...register(`participants.${index}.name`)}
                  defaultValue={participant.name}
                />
                <input
                  type="hidden"
                  {...register(`participants.${index}.email`)}
                  defaultValue={participant.email}
                />
                <input
                  type="hidden"
                  {...register(`participants.${index}.userId`)}
                  defaultValue={participant.userId}
                />

                {/* Display Name + Email */}
                <div className="flex flex-col">
                  <span className="font-semibold">{participant.name}</span>
                  <span className="text-gray-400">
                    {participant.email && `(${participant.email})`}
                  </span>
                </div>

                {/* Paid & Owed */}
                <label className="flex flex-col text-gray-400">
                  Paid
                  <input
                    type="number"
                    placeholder="Paid"
                    {...register(`participants.${index}.amountPaid`)}
                    defaultValue={participant.amountPaid}
                    className="w-20 px-2 py-1 border rounded-lg"
                  />
                </label>

                <label className="flex flex-col text-gray-400">
                  Owed
                  <input
                    type="number"
                    placeholder="Owed"
                    {...register(`participants.${index}.amountOwed`)}
                    defaultValue={participant.amountOwed}
                    className="w-20 px-2 py-1 border rounded-lg"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Split
        </button>
      </form>
    </div>
  );
};

export default AddSplitForm;
