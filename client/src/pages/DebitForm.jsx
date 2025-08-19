import React from 'react'
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AppContext } from '../context/appContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const DebitForm = () => {

  const{debit,setDebit,URL} = useContext(AppContext)

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm();

  const onSubmit = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${URL}/transaction/add-debit`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Append new debit to the existing array
    if (res.data?.data) {
      setDebit((prev) => [...prev, res.data.data]);
    }

    toast.success("Debit added successfully");
    reset();
  } catch (error) {
    console.error("Error adding debit:", error);
    alert("Failed to add debit. Please try again.");
  }
};


  return (
    <div>
      <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4 mt-10"
    >
      <h2 className="text-2xl font-bold mb-4">Add Debit</h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 1, message: "Amount must be greater than 0" },
          })}
          className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          {...register("notes", { required: "Notes are required" })}
          rows="3"
          className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        ></textarea>
        {errors.notes && (
          <p className="text-red-500 text-sm">{errors.notes.message}</p>
        )}
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium">Deadline</label>
        <input
          type="date"
          {...register("deadline", { required: "Deadline is required" })}
          className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errors.deadline && (
          <p className="text-red-500 text-sm">{errors.deadline.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Add Credit"}
      </button>
    </form>
    </div>
  )
}

export default DebitForm