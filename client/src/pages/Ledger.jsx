import React, { useState } from "react";
import { useLedger } from "../context/LedgerContext";
import { useNavigate } from "react-router-dom";

const Ledger = () => {
  const { ledger, deleteLedger, markLedgerCompleted } = useLedger();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Calculations
  const totalCredit = ledger
    .filter((l) => l.type === "credit")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDebit = ledger
    .filter((l) => l.type === "debit")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalCredit - totalDebit;

  // Filtered ledger items
  const filteredLedger = ledger.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getTypeIcon = (type) => {
    if (type === "credit") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 12H4"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Ledger
              </h1>
              <p className="mt-2 text-gray-600">
                Manage and track all your transactions
              </p>
            </div>

            <button
              onClick={() => navigate("/ledger/add")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Record Entry</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Credit
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-green-600">
                  ₹ {totalCredit.toLocaleString()}
                </h2>
              </div>
              <div className="bg-green-100 rounded-xl p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Debit
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-red-600">
                  ₹ {totalDebit.toLocaleString()}
                </h2>
              </div>
              <div className="bg-red-100 rounded-xl p-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100 mb-1">
                  Balance
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  ₹ {balance.toLocaleString()}
                </h2>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section - Desktop */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b-2 border-blue-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Deadline
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredLedger.map((item) => {
                  const isOverdue =
                    item.deadline &&
                    new Date(item.deadline) < new Date() &&
                    item.status !== "completed";

                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-blue-50/50 transition-colors duration-150 ${
                        isOverdue ? "bg-red-50/50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center space-x-1 ${
                            item.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {getTypeIcon(item.type)}
                          <span className="capitalize font-medium">
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ₹ {item.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center space-x-1 ${
                            isOverdue ? "text-red-600" : "text-gray-600"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {item.deadline
                              ? new Date(item.deadline).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                        >
                          {item.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {item.status !== "completed" && (
                            <button
                              onClick={() => markLedgerCompleted(item._id)}
                              className="text-green-600 hover:text-green-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-green-50 transition-colors duration-200"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => deleteLedger(item._id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLedger.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No transactions found</p>
              <p className="text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {filteredLedger.map((item) => {
            const isOverdue =
              item.deadline &&
              new Date(item.deadline) < new Date() &&
              item.status !== "completed";

            return (
              <div
                key={item._id}
                className={`bg-white rounded-2xl shadow-lg border border-blue-100 p-6 ${
                  isOverdue ? "border-red-200 bg-red-50/30" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.name}
                    </h3>
                    <div
                      className={`flex items-center space-x-1 mt-1 ${
                        item.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {getTypeIcon(item.type)}
                      <span className="capitalize font-medium">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                  >
                    {item.status || "pending"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-gray-900">
                      ₹ {item.amount.toLocaleString()}
                    </span>
                  </div>
                  {item.deadline && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Deadline:</span>
                      <span
                        className={
                          isOverdue
                            ? "text-red-600 font-medium"
                            : "text-gray-700"
                        }
                      >
                        {new Date(item.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {item.notes && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Notes:</span>
                      <span className="text-gray-700 text-right flex-1 ml-4">
                        {item.notes}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-blue-100">
                  {item.status !== "completed" && (
                    <button
                      onClick={() => markLedgerCompleted(item._id)}
                      className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 font-medium py-2 rounded-xl transition-colors duration-200"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteLedger(item._id)}
                    className={`${
                      item.status !== "completed" ? "flex-1" : "w-full"
                    } bg-red-50 text-red-700 hover:bg-red-100 font-medium py-2 rounded-xl transition-colors duration-200`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {filteredLedger.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No transactions found</p>
              <p className="text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ledger;
