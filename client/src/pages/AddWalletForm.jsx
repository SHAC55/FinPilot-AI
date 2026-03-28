import React from "react";
import { useForm } from "react-hook-form";
import { useWallet } from "../context/WalletContext";
import toast, { ToastBar } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const AddWalletForm = () => {
  const { createWallet } = useWallet();

  const navigate =  useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await createWallet(data);
      console.log("Wallet created:", data);
      toast.success("Wallet created successfully!");
      navigate("/wallet");
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-gray-200">
        
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Add Wallet
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage your money smartly
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Wallet Name */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Wallet Name
            </label>
            <input
              type="text"
              placeholder="e.g. Personal, Savings"
              {...register("name", { required: "Required" })}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Balance */}
          <input
  type="number"
  value={0}
  readOnly
  {...register("balance")}
  className="no-spinner mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-100 cursor-not-allowed"
/>

          {/* Limit */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Budget Limit (₹)
            </label>
            <input
              type="number"
              placeholder="Monthly limit"
              {...register("limit", {
                required: "Required",
                min: { value: 0, message: "Must be positive" },
              })}
              className="no-spinner mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            {errors.limit && (
              <p className="text-red-500 text-xs mt-1">
                {errors.limit.message}
              </p>
            )}
          </div>

          {/* Wallet Type */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Wallet Type
            </label>
            <select
              {...register("type", { required: "Required" })}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
            >
              <option value="">Select type</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="upi">UPI</option>
              <option value="crypto">Crypto</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Notes
            </label>
            <textarea
              rows="3"
              placeholder="Optional note..."
              {...register("notes")}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-xl font-medium shadow-md"
          >
            Add Wallet
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWalletForm;