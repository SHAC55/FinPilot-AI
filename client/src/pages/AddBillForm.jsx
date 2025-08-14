import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AddBillForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const reminder = watch("setReminder", false);

  const onSubmit = (data) => {
    console.log("Bill Data:", data);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-5"
      >
        <h2 className="text-lg font-semibold text-gray-800">Add New Bill</h2>

        {/* Bill Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Bill Name
          </label>
          <input
            {...register("billName", { required: "Bill name is required" })}
            type="text"
            placeholder="e.g. Electricity Bill"
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.billName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.billName.message}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Amount
          </label>
          <input
            {...register("amount", {
              required: "Amount is required",
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Enter amount"
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Payment Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Payment Frequency
          </label>
          <select
            {...register("frequency", {
              required: "Please select a frequency",
            })}
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select frequency</option>
            <option value="one-time">One-time</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          {errors.frequency && (
            <p className="text-red-500 text-xs mt-1">
              {errors.frequency.message}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Deadline
          </label>
          <input
            {...register("deadline", { required: "Deadline is required" })}
            type="date"
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.deadline && (
            <p className="text-red-500 text-xs mt-1">
              {errors.deadline.message}
            </p>
          )}
        </div>

        {/* Set Reminder */}
        <div className="flex items-center gap-2">
          <input
            {...register("setReminder")}
            type="checkbox"
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-600">
            Set Reminder
          </label>
        </div>

        {/* Reminder Date */}
        {reminder && (
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Reminder Date
            </label>
            <input
              {...register("reminderDate", {
                required: "Reminder date is required when reminder is set",
              })}
              type="datetime-local"
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.reminderDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.reminderDate.message}
              </p>
            )}
          </div>
        )}

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Payment Method
          </label>
          <select
            {...register("paymentMethod", {
              required: "Please select a payment method",
            })}
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select method</option>
            <option value="card">Credit/Debit Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
          </select>
          {errors.paymentMethod && (
            <p className="text-red-500 text-xs mt-1">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Notes
          </label>
          <textarea
            {...register("notes")}
            placeholder="Optional notes about this bill"
            rows={3}
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Add Bill
        </button>
      </form>
    </div>
  );
};

export default AddBillForm;
