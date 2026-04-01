import React from "react";
import { useForm } from "react-hook-form";
import { useLedger } from "../context/LedgerContext";

const AddLedger = () => {
  const { addLedger } = useLedger();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await addLedger({
      ...data,
      amount: Number(data.amount),
    });

    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 sm:mb-0 sm:mr-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Record Entry
            </h1>
            <p className="mt-2 text-gray-600">
              Add a new transaction to your ledger
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden transition-all duration-200 hover:shadow-xl"
        >
          <div className="p-6 sm:p-8 space-y-6">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Name
                <span className="text-blue-600 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  {...register("name", { required: "Name is required" })}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.name 
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                  } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="e.g., Salary, Rent, Groceries"
                />
                {errors.name && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Amount Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Amount
                <span className="text-blue-600 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-blue-500 font-medium text-lg">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", { 
                    required: "Amount is required",
                    min: { value: 0.01, message: "Amount must be greater than 0" }
                  })}
                  className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                    errors.amount 
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                  } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            {/* Type Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Transaction Type
                <span className="text-blue-600 ml-1">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  register("type").value === "credit"
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}>
                  <input
                    type="radio"
                    value="credit"
                    {...register("type", { required: "Type is required" })}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2">
                    <svg className={`w-5 h-5 ${register("type").value === "credit" ? "text-blue-600" : "text-blue-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className={`font-medium ${register("type").value === "credit" ? "text-blue-700" : "text-gray-700"}`}>
                      Credit
                    </span>
                  </div>
                </label>
                
                <label className={`relative flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  register("type").value === "debit"
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}>
                  <input
                    type="radio"
                    value="debit"
                    {...register("type", { required: "Type is required" })}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2">
                    <svg className={`w-5 h-5 ${register("type").value === "debit" ? "text-blue-600" : "text-blue-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    <span className={`font-medium ${register("type").value === "debit" ? "text-blue-700" : "text-gray-700"}`}>
                      Debit
                    </span>
                  </div>
                </label>
              </div>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Deadline Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Deadline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  {...register("deadline")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Notes Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Notes
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <textarea
                  {...register("notes")}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Entry</span>
              </div>
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>All fields marked with <span className="text-blue-600 font-medium">*</span> are required</p>
        </div>
      </div>
    </div>
  );
};

export default AddLedger;