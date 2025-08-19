import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

const categories = [
  'Utilities','Groceries','Salary','Eductaion', "Transport", "Rent", "Entertainment",
  "Shopping", "Medical", "Sports", "Other",
];

const methods = ["Cash", "Card", "UPI", "Wallet"];

const ExpenseForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleAddExpense = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/transaction/add-expense",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Transaction added!");
      console.log("Saved:", res.data);

      reset(); 
    } catch (error) {
      console.error("Error adding transaction:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add transaction");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddExpense)}
      className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-16"
    >
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

      {/* Type */}
      <div>
        <label className="block mb-1 font-medium">Type</label>
        <select
          {...register("type", { required: "Type is required" })}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="">-- Select Type --</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
      </div>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="e.g. Grocery Shopping"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="block mb-1 font-medium">Amount (₹)</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Amount must be positive" },
          })}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="e.g. 1500"
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          {...register("date", { required: "Date is required" })}
          className="w-full border border-gray-300 p-2 rounded"
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          {...register("category", { required: "Category is required" })}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      {/* Payment Method */}
      <div>
        <label className="block mb-1 font-medium">Payment Method</label>
        <select
          {...register("method", { required: "Payment method is required" })}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="">-- Select Method --</option>
          {methods.map((method, idx) => (
            <option key={idx} value={method}>{method}</option>
          ))}
        </select>
        {errors.method && <p className="text-red-500 text-sm">{errors.method.message}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-1 font-medium">Notes (optional)</label>
        <textarea
          {...register("notes")}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="e.g. Bought extra fruits"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default ExpenseForm;
