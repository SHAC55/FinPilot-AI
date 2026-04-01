import React, { useEffect, useState } from "react";
import { useSplitBill } from "../context/SplitBillContext";
import {
  Trash2,
  Edit2,
  Save,
  X,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Check,
  Users,
  Receipt,
  BadgePlus,
  XCircle,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}
      >
        {icons[type]}
        <p className="flex-1 text-sm">{message}</p>
        <button onClick={onClose} className="hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const SplitBills = () => {
  const { bills, getBills, updateBill, deleteBill, settlePayment } =
    useSplitBill();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [settlingBillId, setSettlingBillId] = useState(null);
  const [settlingUserId, setSettlingUserId] = useState(null);
  const [toast, setToast] = useState(null);

  // EDIT STATES
  const [editingBillId, setEditingBillId] = useState(null);
  const [editedSplits, setEditedSplits] = useState([]);

  // Show toast message
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      await getBills();
      setLoading(false);
    };
    fetchBills();
  }, []);

  // EDIT CLICK
  const handleEditClick = (bill) => {
    setEditingBillId(bill._id);
    setEditedSplits(JSON.parse(JSON.stringify(bill.splits)));
  };

  // INPUT CHANGE
  const handleSplitChange = (index, field, value) => {
    const updated = [...editedSplits];
    updated[index][field] = Number(value);
    setEditedSplits(updated);
  };

  // SAVE
  const handleSave = async (billId) => {
    try {
      await updateBill(billId, { splits: editedSplits });
      setEditingBillId(null);
      showToast("Bill updated successfully!", "success");
    } catch (error) {
      showToast("Failed to update bill. Please try again.", "error");
    }
  };

  // CANCEL
  const handleCancel = () => {
    setEditingBillId(null);
    setEditedSplits([]);
  };

  // DELETE
  const handleDelete = async (billId) => {
    setDeletingId(billId);
    try {
      await deleteBill(billId);
      showToast("Bill deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete bill. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // SETTLE PAYMENT
  const handleSettlePayment = async (billId, userId, amountOwed) => {
    setSettlingBillId(billId);
    setSettlingUserId(userId);
    try {
      await settlePayment(billId, userId, amountOwed);
      showToast(`Payment of ₹${amountOwed} settled successfully!`, "success");
    } catch (error) {
      showToast("Failed to settle payment. Please try again.", "error");
    } finally {
      setSettlingBillId(null);
      setSettlingUserId(null);
    }
  };

  // SETTLE ALL PAYMENTS FOR A BILL
  const handleSettleAll = async (bill) => {
    const unsettledPayments = bill.splits.filter((split) => {
      const balance = (split.amountPaid || 0) - (split.amountOwed || 0);
      return balance < 0;
    });

    if (unsettledPayments.length === 0) {
      showToast("All payments are already settled!", "info");
      return;
    }

    let settledCount = 0;
    let failedCount = 0;

    for (const split of unsettledPayments) {
      const balance = Math.abs(
        (split.amountPaid || 0) - (split.amountOwed || 0),
      );
      try {
        await settlePayment(bill._id, split.user, balance);
        settledCount++;
      } catch (error) {
        failedCount++;
      }
    }

    await getBills(); // Refresh bills after settling all

    if (failedCount === 0) {
      showToast(`Successfully settled ${settledCount} payment(s)!`, "success");
    } else {
      showToast(
        `Settled ${settledCount} payment(s). ${failedCount} failed.`,
        "warning",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="bg-blue-600 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Split Bills
              </h1>
              <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage and track all your shared expenses
              </p>
            </div>
            <button
              onClick={() => navigate("/create-split-bill")}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <BadgePlus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add New Bill
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {bills.map((bill) => {
            const totalPaid =
              bill.splits?.reduce((sum, s) => sum + s.amountPaid, 0) || 0;

            const totalOwed =
              bill.splits?.reduce((sum, s) => sum + s.amountOwed, 0) || 0;

            const isSettled = totalPaid === totalOwed;
            const isDeleting = deletingId === bill._id;

            return (
              <div
                key={bill._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="p-4 sm:p-5 flex-1">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <h2 className="font-bold text-lg sm:text-xl text-gray-800 truncate">
                          {bill.title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                        <p className="text-xs sm:text-sm font-medium">
                          Total: ₹{bill.totalAmount}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0 ${
                        isSettled
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {isSettled ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span className="hidden sm:inline">Settled</span>
                            <span className="sm:hidden">✓</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span className="hidden sm:inline">Pending</span>
                            <span className="sm:hidden">!</span>
                          </>
                        )}
                      </span>
                    </span>
                  </div>

                  {/* Splits */}
                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 max-h-80 overflow-y-auto">
                    {bill.splits.map((split, index) => {
                      const user = bill.participants?.find(
                        (p) => p._id?.toString() === split.user?.toString(),
                      );

                      const balance =
                        (split.amountPaid || 0) - (split.amountOwed || 0);

                      const isSettling =
                        settlingBillId === bill._id &&
                        settlingUserId === split.user;
                      const needsSettlement = balance < 0;

                      return (
                        <div
                          key={split.user}
                          className="bg-gray-50 rounded-xl p-2 sm:p-3 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-semibold text-blue-700">
                                  {user?.username?.charAt(0).toUpperCase() ||
                                    "?"}
                                </span>
                              </div>
                              <p className="font-medium text-gray-700 text-sm sm:text-base truncate">
                                {user?.username || "Unknown"}
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0">
                              {balance > 0 ? (
                                <span className="text-green-600 font-semibold text-xs sm:text-sm">
                                  Gets ₹{balance}
                                </span>
                              ) : balance < 0 ? (
                                <span className="text-red-600 font-semibold text-xs sm:text-sm">
                                  Owes ₹{Math.abs(balance)}
                                </span>
                              ) : (
                                <span className="text-gray-500 text-xs sm:text-sm">
                                  Settled
                                </span>
                              )}
                            </div>
                          </div>

                          {editingBillId === bill._id ? (
                            <div className="flex gap-2 mt-2 sm:mt-3">
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">
                                  Paid
                                </label>
                                <input
                                  type="number"
                                  value={editedSplits[index]?.amountPaid || 0}
                                  onChange={(e) =>
                                    handleSplitChange(
                                      index,
                                      "amountPaid",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">
                                  Owes
                                </label>
                                <input
                                  type="number"
                                  value={editedSplits[index]?.amountOwed || 0}
                                  onChange={(e) =>
                                    handleSplitChange(
                                      index,
                                      "amountOwed",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex gap-2 sm:gap-3 mt-1 sm:mt-2 text-xs">
                                <span className="text-green-600">
                                  Paid: ₹{split.amountPaid}
                                </span>
                                <span className="text-red-600">
                                  Owes: ₹{split.amountOwed}
                                </span>
                              </div>

                              {needsSettlement &&
                                !isSettled &&
                                editingBillId !== bill._id && (
                                  <button
                                    onClick={() =>
                                      handleSettlePayment(
                                        bill._id,
                                        split.user,
                                        Math.abs(balance),
                                      )
                                    }
                                    disabled={isSettling}
                                    className="mt-2 w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2"
                                  >
                                    {isSettling ? (
                                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <>
                                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Settle ₹{Math.abs(balance)}
                                      </>
                                    )}
                                  </button>
                                )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-3 sm:mb-4">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-green-600 font-medium">
                        Paid: ₹{totalPaid}
                      </span>
                      <span className="text-red-600 font-medium">
                        Owed: ₹{totalOwed}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3">
                    {editingBillId === bill._id ? (
                      <>
                        <button
                          onClick={() => handleSave(bill._id)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
                        >
                          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                          Save
                        </button>

                        <button
                          onClick={handleCancel}
                          className="flex-1 bg-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(bill)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(bill._id)}
                          disabled={isDeleting}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              Delete
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Settle All Button */}
                  {!isSettled && editingBillId !== bill._id && (
                    <button
                      onClick={() => handleSettleAll(bill)}
                      className="mt-2 sm:mt-3 w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      Settle All
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {!isSettled && (
                  <div className="h-1 bg-gray-100">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500"
                      style={{
                        width: `${(totalPaid / bill.totalAmount) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {bills.length === 0 && !loading && (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm max-w-md mx-auto">
              <div className="text-5xl sm:text-6xl mb-4">💰</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                No bills yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                Create your first split bill to get started
              </p>
              <button
                onClick={() => navigate("/create-split-bill")}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base"
              >
                <BadgePlus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create Bill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitBills;
