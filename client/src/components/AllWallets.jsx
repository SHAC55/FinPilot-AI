import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

const AllWallets = () => {
  const {
    wallets,
    getWallets,
    deleteWallet,
    updateWallet,
    loading,
    transactions,
    getTransactionsByWallet,
  } = useWallet();

  const navigate  =  useNavigate();

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [newLimit, setNewLimit] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getWallets();
  }, []);

  const handleWalletChange = (walletId) => {
    setSelectedWallet(walletId);

    if (walletId) {
      getTransactionsByWallet(walletId);
    } else {
      // optional: call all transactions API
    }
  };

  //  Edit handler (opens modal)
  const handleEdit = (wallet) => {
    setEditingWallet(wallet);
    setNewLimit(wallet.limit.toString());
    setError("");
    setIsEditModalOpen(true);
  };

  //  Save edited limit
  const handleSaveLimit = async () => {
    const limitValue = parseFloat(newLimit);

    if (isNaN(limitValue) || limitValue < 0) {
      setError("Please enter a valid positive number");
      return;
    }

    if (limitValue === editingWallet.limit) {
      setIsEditModalOpen(false);
      return;
    }

    try {
      await updateWallet(editingWallet._id, {
        limit: Number(limitValue),
      });
      setIsEditModalOpen(false);
      setEditingWallet(null);
      setNewLimit("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to update limit. Please try again.");
    }
  };

  // Close modal
  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingWallet(null);
    setNewLimit("");
    setError("");
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isEditModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isEditModalOpen]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get progress percentage
  const getProgressPercentage = (balance, limit) => {
    if (!limit || limit === 0) return 0;
    const percentage = (balance / limit) * 100;
    return Math.min(percentage, 100);
  };

  // Get status color based on usage
  const getStatusColor = (percentage) => {
    if (percentage >= 90) return "text-red-600 bg-red-50";
    if (percentage >= 70) return "text-orange-600 bg-orange-50";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-emerald-600 bg-emerald-50";
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          {/* <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
              Wallets
            </h1>
            <p className="text-gray-500 mt-2 font-light">
              Manage and track your financial accounts
            </p>
          </div> */}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-900 border-t-transparent absolute top-0 left-0"></div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && wallets.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 10h18M6 14h6m-6 4h12M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No wallets yet
              </h3>
              <p className="text-gray-500">
                Create your first wallet to get started
              </p>
            </div>
          )}

          {/* Wallet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet) => {
              const percentage = getProgressPercentage(
                wallet.balance,
                wallet.limit,
              );
              const statusColor = getStatusColor(percentage);

              return (
                <div
                  key={wallet._id}
                  onClick={() => navigate(`/wallet/${wallet._id}`)} 
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                >
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          {wallet.name}
                        </h2>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                        >
                          {wallet.type}
                        </span>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(wallet)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit limit"
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
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this wallet?")) {
                              deleteWallet(wallet._id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete wallet"
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
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Balance Section */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">
                        Current Balance
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(wallet.balance)}
                      </p>
                    </div>

                    {/* Limit Progress */}
                    {wallet.limit > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Limit Usage</span>
                          <span className="text-gray-900 font-medium">
                            {formatCurrency(wallet.balance)} /{" "}
                            {formatCurrency(wallet.limit)}
                          </span>
                        </div>
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="absolute h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500">0%</span>
                          <span className="text-xs text-gray-500">
                            {Math.round(percentage)}% used
                          </span>
                          <span className="text-xs text-gray-500">100%</span>
                        </div>
                      </div>
                    )}

                    {/* Remaining Balance */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-gray-500">
                          Remaining Limit
                        </span>
                        <span className="text-lg font-semibold text-emerald-600">
                          {formatCurrency(wallet.remaining)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Limit Modal */}
      {isEditModalOpen && editingWallet && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slide-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Edit Budget Limit
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingWallet.name}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
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
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Current Balance Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Current Balance
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(editingWallet.balance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Limit</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(editingWallet.limit)}
                    </span>
                  </div>
                </div>

                {/* Limit Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Limit Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={newLimit}
                      onChange={(e) => {
                        setNewLimit(e.target.value);
                        setError("");
                      }}
                      className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        error
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                      }`}
                      placeholder="Enter new limit"
                      step="100"
                      min="0"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {error}
                    </p>
                  )}
                </div>

                {/* Warning Message */}
                {parseFloat(newLimit) < editingWallet.balance &&
                  !error &&
                  newLimit !== "" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <div className="flex gap-2">
                        <svg
                          className="w-5 h-5 text-amber-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            Warning
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            New limit is less than current balance. This may
                            cause overspending alerts.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLimit}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllWallets;
