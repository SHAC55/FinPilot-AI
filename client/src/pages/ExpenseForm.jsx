import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../api.js";
import { useWallet } from "../context/WalletContext";
import {
  Plus,
  Wallet,
  Tag,
  DollarSign,
  Calendar,
  FolderOpen,
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  X,
  Check,
  ArrowLeft,
  Loader2,
  Sparkles,
  Home,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Car,
  Building2,
  Film,
  Shirt,
  Heart,
  Dumbbell,
  MoreHorizontal,
  Coffee,
  Smartphone,
  Landmark,
  Receipt,
  Banknote,
  ChevronDown,
  Circle,
} from "lucide-react";

/* ================= CATEGORY CONFIG ================= */
const categories = [
  { value: "Utilities", label: "Utilities", icon: Home, color: "blue", bgLight: "bg-blue-50", textColor: "text-blue-600", borderColor: "border-blue-200" },
  { value: "Groceries", label: "Groceries", icon: ShoppingBag, color: "green", bgLight: "bg-green-50", textColor: "text-green-600", borderColor: "border-green-200" },
  { value: "Income", label: "Income", icon: Briefcase, color: "emerald", bgLight: "bg-emerald-50", textColor: "text-emerald-600", borderColor: "border-emerald-200" },
  { value: "Education", label: "Education", icon: GraduationCap, color: "purple", bgLight: "bg-purple-50", textColor: "text-purple-600", borderColor: "border-purple-200" },
  { value: "Travel", label: "Travel", icon: Car, color: "yellow", bgLight: "bg-amber-50", textColor: "text-amber-600", borderColor: "border-amber-200" },
  { value: "Rent", label: "Rent", icon: Building2, color: "orange", bgLight: "bg-orange-50", textColor: "text-orange-600", borderColor: "border-orange-200" },
  { value: "Entertainment", label: "Entertainment", icon: Film, color: "pink", bgLight: "bg-pink-50", textColor: "text-pink-600", borderColor: "border-pink-200" },
  { value: "Shopping", label: "Shopping", icon: Shirt, color: "rose", bgLight: "bg-rose-50", textColor: "text-rose-600", borderColor: "border-rose-200" },
  { value: "Medical", label: "Medical", icon: Heart, color: "red", bgLight: "bg-red-50", textColor: "text-red-600", borderColor: "border-red-200" },
  { value: "Sports", label: "Sports", icon: Dumbbell, color: "indigo", bgLight: "bg-indigo-50", textColor: "text-indigo-600", borderColor: "border-indigo-200" },
  { value: "Other", label: "Other", icon: MoreHorizontal, color: "gray", bgLight: "bg-gray-50", textColor: "text-gray-600", borderColor: "border-gray-200" },
];

/* ================= PAYMENT METHODS ================= */
const methods = [
  { value: "Cash", label: "Cash", icon: Banknote, color: "green", bgLight: "bg-green-50", textColor: "text-green-600" },
  { value: "Card", label: "Card", icon: CreditCard, color: "blue", bgLight: "bg-blue-50", textColor: "text-blue-600" },
  { value: "UPI", label: "UPI", icon: Smartphone, color: "purple", bgLight: "bg-purple-50", textColor: "text-purple-600" },
  { value: "Wallet", label: "Wallet", icon: Landmark, color: "orange", bgLight: "bg-orange-50", textColor: "text-orange-600" },
];

const ExpenseForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const { wallets, getWallets } = useWallet();
  const selectedType = watch("type");
  const selectedTypeValue = watch("type");

  /* ===== AUTO SELECT WALLET ===== */
  useEffect(() => {
    if (wallets?.length > 0) {
      setValue("wallet", wallets[0]._id);
    }
  }, [wallets, setValue]);

  useEffect(() => {
    getWallets();
  }, []);

  /* ===== SUBMIT ===== */
  const handleAddExpense = async (data) => {
    setIsSubmitting(true);
    try {
      await API.post("/transaction/add-transaction", data);

      toast.success("Transaction added successfully!", {
        icon: "✅",
        style: {
          borderRadius: "12px",
          background: "#0f172a",
          color: "#fff",
        },
      });

      reset({
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });

      setSelectedCategory("");
      setSelectedMethod("");
      getWallets();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add transaction", {
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeStyles = (type) => {
    if (selectedType === type) {
      return type === "expense"
        ? "bg-gradient-to-r from-red-500 to-red-600 border-none text-white shadow-lg shadow-red-200 scale-[1.02]"
        : "bg-gradient-to-r from-emerald-500 to-emerald-600 border-none text-white shadow-lg shadow-emerald-200 scale-[1.02]";
    }
    return "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:scale-[1.01]";
  };

  const getCategoryStyles = (catValue) => {
    const category = categories.find(c => c.value === catValue);
    if (selectedCategory === catValue) {
      return `${category?.bgLight} ${category?.borderColor} border-2 shadow-sm ring-2 ring-offset-1 ring-${category?.color}-200`;
    }
    return "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm";
  };

  const getMethodStyles = (methodValue) => {
    const method = methods.find(m => m.value === methodValue);
    if (selectedMethod === methodValue) {
      return `${method?.bgLight} border-2 border-${method?.color}-300 shadow-sm`;
    }
    return "bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - Modern with gradient accent */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-12 bg-gradient-to-b from-slate-700 to-slate-500 rounded-full"></div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                <Sparkles className="w-8 h-8 text-slate-600" />
                New Transaction
              </h1>
              <p className="text-slate-500 text-sm mt-1 ml-2">
                Track your finances with precision and style
              </p>
            </div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Main Form Card - Glassmorphism effect */}
        <form
          onSubmit={handleSubmit(handleAddExpense)}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-8 space-y-6 transition-all duration-300"
        >
          {/* Hidden Category Field */}
          <input type="hidden" {...register("category", { required: "Category is required" })} />

          {/* Transaction Type Toggle - Modern Segmented Control */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue("type", "expense");
                  setSelectedCategory("");
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${getTypeStyles(
                  "expense"
                )}`}
              >
                <TrendingDown className="w-4 h-4" />
                Expense
                {selectedType === "expense" && <Check className="w-4 h-4 ml-1" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setValue("type", "income");
                  setSelectedCategory("");
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${getTypeStyles(
                  "income"
                )}`}
              >
                <TrendingUp className="w-4 h-4" />
                Income
                {selectedType === "income" && <Check className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </div>

          {/* Two Column Layout for Medium+ Screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Wallet Selector - Modern Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Select Wallet
                </label>
                <div className="relative">
                  <select
                    {...register("wallet", { required: "Wallet is required" })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    {wallets.map((w) => (
                      <option key={w._id} value={w._id}>
                        {w.name} • ₹{w.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.wallet && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-red-500" /> {errors.wallet.message}
                  </p>
                )}
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Title / Description
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g., Grocery shopping, Salary, etc."
                  className={`w-full px-4 py-3 rounded-xl border ${focusedField === "title" ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-200"} bg-white transition-all duration-200 focus:outline-none`}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Amount (₹)
                </label>
                <input
                  type="number"
                  {...register("amount", { 
                    required: "Amount is required",
                    min: { value: 1, message: "Amount must be greater than 0" }
                  })}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 rounded-xl border ${focusedField === "amount" ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-200"} bg-white transition-all duration-200 focus:outline-none`}
                  onFocus={() => setFocusedField("amount")}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                )}
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Transaction Date
                </label>
                <input
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Category Grid - Modern with Icons */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.value);
                          setValue("category", cat.value);
                        }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 ${getCategoryStyles(
                          cat.value
                        )} ${isSelected ? cat.bgLight : "hover:bg-gray-50"}`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? cat.textColor : "text-gray-500"}`} />
                        <span className={`text-sm font-medium ${isSelected ? cat.textColor : "text-gray-700"}`}>
                          {cat.label}
                        </span>
                        {isSelected && <Check className="ml-auto w-3.5 h-3.5 text-green-500" />}
                      </button>
                    );
                  })}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Payment Method Grid */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {methods.map((m) => {
                    const Icon = m.icon;
                    const isSelected = selectedMethod === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => {
                          setSelectedMethod(m.value);
                          setValue("method", m.value);
                        }}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 ${getMethodStyles(
                          m.value
                        )} ${isSelected ? m.bgLight : "hover:bg-gray-50"}`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? m.textColor : "text-gray-500"}`} />
                        <span className={`text-xs sm:text-sm font-medium ${isSelected ? m.textColor : "text-gray-700"}`}>
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Additional Notes
                </label>
                <textarea
                  {...register("notes")}
                  placeholder="Optional: Add any remarks or details..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Submit Button - Modern Gradient */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Processing Transaction...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Transaction
              </>
            )}
          </button>

          {/* Quick Tip */}
          <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            Always keep your transactions organized for better insights
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;