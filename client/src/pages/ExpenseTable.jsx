import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { AppContext } from "../context/appContext";

const ExpenseTable = () => {
  const { expenses, setExpenses, deleteItem } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllExpenses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/transaction/get-expenses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const userExpenses = res.data.data || [];
        setExpenses(userExpenses);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError("Unable to fetch expenses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllExpenses();
  }, [setExpenses]);



  return (
    <div className="w-full px-4 py-6">
      <div className="mx-auto bg-white rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          💸 Your Transactions
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : expenses && expenses.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 h-[550px] overflow-y-scroll">
            <table className="min-w-full text-sm text-left ">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white uppercase text-xs tracking-wider">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {expenses.map((expense, index) => (
                  <tr
                    key={expense._id}
                    className={`hover:bg-indigo-50 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } transition-colors`}
                  >
                    <td className="px-4 py-3">{expense.title}</td>

                    <td
                      className={`px-4 py-3 font-bold ${
                        expense.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ₹{expense.amount}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          expense.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {expense.type}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        {expense.category}
                      </span>
                    </td>

                    <td className="px-4 py-3 capitalize">{expense.method}</td>
                    <td className="px-4 py-3">{expense.notes}</td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          deleteItem("transaction/delete-expense", expense._id, setExpenses)
                        }
                        className="rounded-full p-2 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <AiFillDelete
                          size={20}
                          className="text-red-600 hover:text-red-800"
                        />
                      </button>
                    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;
