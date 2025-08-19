
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "../context/appContext";

const AddGoalForm = () => {

  const{ goals,setGoals,URL } =  useContext(AppContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${URL}/goal/add-goal`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(res.data.success){
        setGoals((prev) =>  [...prev,res.data.data])
      }
      console.log(res.data);
      toast.success("Goal added successfully");
      reset();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add goal");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Add New Financial Goal
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Goal Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Goal Name
          </label>
          <input
            type="text"
            placeholder="e.g. Buy a Car"
            {...register("goalName", { required: "Goal name is required" })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.goalName && (
            <p className="text-red-500 text-sm">{errors.goalName.message}</p>
          )}
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Target Amount
          </label>
          <input
            type="number"
            placeholder="e.g. 500000"
            {...register("targetAmount", {
              required: "Target amount is required",
              min: { value: 1, message: "Amount must be greater than 0" },
            })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.targetAmount && (
            <p className="text-red-500 text-sm">
              {errors.targetAmount.message}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Target Date
          </label>
          <input
            type="date"
            {...register("deadline", { required: "Target date is required" })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.targetDate && (
            <p className="text-red-500 text-sm">{errors.targetDate.message}</p>
          )}
        </div>

        {/* Saved Amount */}
        <input
          {...register("savedAmount")}
          type="number"
          placeholder="Saved Amount"
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition duration-200"
        >
          Add Goal
        </button>

      </form>
    </div>
  );
};

export default AddGoalForm;
