import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import API from "../api.js";
import { useSplitBill } from "../context/SplitBillContext.jsx";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  X, 
  UserPlus, 
  IndianRupee,
  Trash2,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Receipt,
  Calculator
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateSplitBill = () => {
  const { createBill } = useSplitBill();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState([]);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const searchRef = useRef(null);
  
  const totalAmount = watch("totalAmount");
  const title = watch("title");

  // Calculate totals
  const calculateParticipantTotals = () => {
    let paidSum = 0;
    let owedSum = 0;
    
    participants.forEach((_, index) => {
      const paid = Number(watch(`paid_${index}`)) || 0;
      const owed = Number(watch(`owed_${index}`)) || 0;
      paidSum += paid;
      owedSum += owed;
    });
    
    return { totalPaid: paidSum, totalOwed: owedSum };
  };
  
  const { totalPaid, totalOwed } = calculateParticipantTotals();
  const billAmount = Number(totalAmount) || 0;
  
  // Validate paid amounts
  const validatePaidAmounts = () => {
    const errors = {};
    
    if (billAmount > 0 && Math.abs(totalPaid - billAmount) > 0.01) {
      errors.totalPaid = `Total paid (₹${totalPaid.toFixed(2)}) must equal bill amount (₹${billAmount.toFixed(2)})`;
    }
    
    // Check if any participant has negative amounts
    participants.forEach((_, index) => {
      const paid = Number(watch(`paid_${index}`)) || 0;
      const owed = Number(watch(`owed_${index}`)) || 0;
      
      if (paid < 0) {
        errors[`paid_${index}`] = "Amount cannot be negative";
      }
      if (owed < 0) {
        errors[`owed_${index}`] = "Amount cannot be negative";
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Re-validate whenever paid amounts or total amount changes
  useEffect(() => {
    if (participants.length > 0 && billAmount > 0) {
      validatePaidAmounts();
    }
  }, [totalPaid, billAmount, participants.length]);

  // 🔍 search users
  const searchUsers = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setSearch([]);
      setShowSuggestions(false);
      return;
    }
    
    setSearching(true);
    try {
      const { data } = await API.get(`/auth/searchuser?email=${value}`);
      setSearch(data.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearch([]);
    } finally {
      setSearching(false);
    }
  };

  const addUser = (user) => {
    if (participants.find((p) => p._id === user._id)) return;
    setParticipants((prev) => [...prev, user]);
    setSearch([]);
    setQuery("");
    setShowSuggestions(false);
  };

  const removeUser = (index) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  };

  // Auto-fill equal split
  const autoFillEqualSplit = () => {
    if (participants.length === 0 || billAmount === 0) return;
    
    const equalAmount = billAmount / participants.length;
    participants.forEach((_, index) => {
      setValue(`paid_${index}`, equalAmount.toFixed(2));
      setValue(`owed_${index}`, "0");
    });
  };

  // Auto-fill based on paid amounts (owes = paid)
  const autoFillOwesEqual = () => {
    participants.forEach((_, index) => {
      const paid = Number(watch(`paid_${index}`)) || 0;
      setValue(`owed_${index}`, paid.toFixed(2));
    });
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // submit with validation
  const onSubmit = async (data) => {
    if (participants.length === 0) {
      alert("Please add at least one participant");
      return;
    }
    
    // Validate paid amounts
    if (!validatePaidAmounts()) {
      alert("Please fix validation errors before submitting");
      return;
    }
    
    // Check if total paid equals bill amount
    if (Math.abs(totalPaid - billAmount) > 0.01) {
      alert(`Total paid amount (₹${totalPaid.toFixed(2)}) must equal the bill amount (₹${billAmount.toFixed(2)})`);
      return;
    }
    
    setIsSubmitting(true);
    
    const splits = participants.map((user, index) => ({
      user: user._id,
      amountPaid: Number(data[`paid_${index}`] || 0),
      amountOwed: Number(data[`owed_${index}`] || 0),
    }));
    
    try {
      await createBill({
        title: data.title,
        totalAmount: Number(data.totalAmount),
        participants: participants.map((u) => u._id),
        splits,
        date: new Date(),
        status: "pending",
      });
      navigate("/split-bills");
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("Failed to create bill. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/split-bills")}
            className="p-1 -ml-1 text-gray-600 active:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Create Split Bill</h1>
            <p className="text-xs text-gray-500">Split expenses with friends</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Bill Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Receipt className="w-5 h-5" />
              <h2 className="font-semibold">Bill Details</h2>
            </div>
            
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bill Title *
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                placeholder="e.g., Dinner at Pizza Place"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.title ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
            
            {/* Total Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  {...register("totalAmount", { 
                    required: "Total amount is required",
                    min: { value: 0.01, message: "Amount must be greater than 0" }
                  })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              {errors.totalAmount && (
                <p className="text-xs text-red-500 mt-1">{errors.totalAmount.message}</p>
              )}
            </div>
          </div>

          {/* Add Participants */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5" />
                <h2 className="font-semibold">Participants</h2>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {participants.length} added
              </span>
            </div>
            
            {/* Search Input */}
            <div ref={searchRef} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => searchUsers(e.target.value)}
                  onFocus={() => query && setShowSuggestions(true)}
                  placeholder="Search by email or username"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                )}
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && search.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {search.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => addUser(user)}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <UserPlus className="w-4 h-4 text-blue-500" />
                    </button>
                  ))}
                </div>
              )}
              
              {showSuggestions && search.length === 0 && query && !searching && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
                  <p className="text-sm text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>

          {/* Splits Section */}
          {participants.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calculator className="w-5 h-5" />
                  <h2 className="font-semibold">Split Details</h2>
                </div>
                <div className="flex gap-2">
                  {billAmount > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={autoFillEqualSplit}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100 transition"
                      >
                        Equal Split
                      </button>
                      <button
                        type="button"
                        onClick={autoFillOwesEqual}
                        className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
                      >
                        Copy Paid to Owes
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {participants.map((user, index) => (
                  <div key={user._id} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-700">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUser(index)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Amount Paid
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            {...register(`paid_${index}`)}
                            onChange={() => validatePaidAmounts()}
                            placeholder="0.00"
                            className={`w-full pl-7 pr-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                              validationErrors[`paid_${index}`] ? "border-red-300 bg-red-50" : "border-gray-200"
                            }`}
                          />
                        </div>
                        {validationErrors[`paid_${index}`] && (
                          <p className="text-xs text-red-500 mt-1">{validationErrors[`paid_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Amount Owes
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            {...register(`owed_${index}`)}
                            placeholder="0.00"
                            className={`w-full pl-7 pr-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                              validationErrors[`owed_${index}`] ? "border-red-300 bg-red-50" : "border-gray-200"
                            }`}
                          />
                        </div>
                        {validationErrors[`owed_${index}`] && (
                          <p className="text-xs text-red-500 mt-1">{validationErrors[`owed_${index}`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Card with Validation */}
              <div className={`rounded-lg p-4 space-y-2 border ${
                validationErrors.totalPaid ? "bg-red-50 border-red-200" : "bg-gradient-to-r from-gray-50 to-white border-gray-100"
              }`}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Bill Amount:</span>
                  <span className="font-semibold text-gray-900">₹{billAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Paid by All:</span>
                  <span className={`font-semibold ${
                    Math.abs(totalPaid - billAmount) <= 0.01 && billAmount > 0
                      ? "text-green-600"
                      : totalPaid > 0 ? "text-orange-600" : "text-gray-600"
                  }`}>
                    ₹{totalPaid.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Owed by All:</span>
                  <span className="font-semibold text-blue-600">₹{totalOwed.toFixed(2)}</span>
                </div>
                
                {billAmount > 0 && (
                  <div className={`mt-2 pt-2 border-t ${
                    validationErrors.totalPaid ? "border-red-200" : "border-gray-200"
                  }`}>
                    {validationErrors.totalPaid ? (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100 p-2 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{validationErrors.totalPaid}</span>
                      </div>
                    ) : Math.abs(totalPaid - billAmount) <= 0.01 && totalPaid > 0 ? (
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>✓ Total paid matches the bill amount!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-blue-500" />
                        <span>
                          Total paid must equal ₹{billAmount.toFixed(2)} to create the bill
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-700 mb-1">💡 Tips:</p>
                <ul className="space-y-1">
                  <li>• Total paid amount must equal the total bill amount</li>
                  <li>• Use "Equal Split" to automatically divide the bill equally</li>
                  <li>• Amounts cannot be negative</li>
                  <li>• You can enter custom amounts for each participant</li>
                </ul>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="sticky bottom-4">
            <button
              type="submit"
              disabled={
                isSubmitting || 
                participants.length === 0 || 
                !title || 
                !totalAmount ||
                Math.abs(totalPaid - billAmount) > 0.01 ||
                Object.keys(validationErrors).length > 0
              }
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all active:scale-98"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Bill...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Split Bill
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSplitBill;