import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { 
  Search, 
  Calendar, 
  Filter, 
  ArrowUpDown,
  Download,
  ChevronDown,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard
} from "lucide-react";

const WalletDetails = () => {
  const { id } = useParams();
  const { wallets, transactions, getTransactionsByWallet } = useWallet();
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  const wallet = wallets.find((w) => w._id === id);

  useEffect(() => {
    if (id) {
      getTransactionsByWallet(id);
    }
  }, [id]);

  // Get unique years and months from transactions
  const availableYears = useMemo(() => {
    const years = new Set();
    transactions.forEach(t => {
      const date = new Date(t.date);
      years.add(date.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  const availableMonths = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by month
    if (filterMonth !== "") {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date.getMonth().toString() === filterMonth;
      });
    }

    // Filter by year
    if (filterYear !== "") {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear().toString() === filterYear;
      });
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [transactions, filterMonth, filterYear, searchTerm, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalExpense = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalIncome = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { totalExpense, totalIncome, net: totalIncome - totalExpense };
  }, [filteredTransactions]);

  const handleResetFilters = () => {
    setFilterMonth("");
    setFilterYear("");
    setSearchTerm("");
    setSortOrder("desc");
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: "bg-orange-100 text-orange-700",
      shopping: "bg-pink-100 text-pink-700",
      transport: "bg-blue-100 text-blue-700",
      entertainment: "bg-purple-100 text-purple-700",
      bills: "bg-red-100 text-red-700",
      salary: "bg-green-100 text-green-700",
      investment: "bg-indigo-100 text-indigo-700",
      default: "bg-gray-100 text-gray-700",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  if (!wallet) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            ← Back to Wallets
          </button>
        </div>

        {/* Wallet Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl mb-8 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-6 h-6" />
                <h1 className="text-2xl font-bold">{wallet.name}</h1>
              </div>
              <p className="text-blue-100">{wallet.type}</p>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <p className="text-sm">Wallet ID</p>
              <p className="font-mono text-sm">{wallet._id?.slice(-8)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6 pt-4 border-t border-blue-500/30">
            <div>
              <p className="text-sm text-blue-100 mb-1">Current Balance</p>
              <p className="text-3xl font-bold">₹{wallet.balance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-blue-100 mb-1">Spending Limit</p>
              <p className="text-3xl font-bold">₹{wallet.limit.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          {wallet.limit > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Limit Usage</span>
                <span>{((wallet.balance / wallet.limit) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-blue-400/30 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${Math.min((wallet.balance / wallet.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        {filteredTransactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">₹{stats.totalIncome.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Expense</p>
                  <p className="text-2xl font-bold text-red-600">₹{stats.totalExpense.toLocaleString()}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Net Balance</p>
                  <p className={`text-2xl font-bold ${stats.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{stats.net.toLocaleString()}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 border-b">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="font-semibold">Filters & Search</span>
                {(filterMonth || filterYear || searchTerm) && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    Active Filters
                  </span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Month Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Month
                  </label>
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Months</option>
                    {availableMonths.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Year
                  </label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Years</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ArrowUpDown className="inline w-4 h-4 mr-1" />
                    Sort by Date
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Reset Filters Button */}
              {(filterMonth || filterYear || searchTerm) && (
                <div className="flex justify-end">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Transactions
              <span className="ml-2 text-sm text-gray-500 font-normal">
                ({filteredTransactions.length})
              </span>
            </h2>
            {filteredTransactions.length > 0 && (
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-3">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500">No transactions found</p>
              {(filterMonth || filterYear || searchTerm) && (
                <button
                  onClick={handleResetFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear filters to see all transactions
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(t.category)}`}>
                      {t.type === "expense" ? (
                        <TrendingDown className="w-5 h-5" />
                      ) : (
                        <TrendingUp className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{t.title}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(t.category)}`}>
                          {t.category || "Uncategorized"}
                        </span>
                      </div>
                      {t.description && (
                        <p className="text-sm text-gray-500">{t.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(t.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-bold ${t.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                      {t.type === "expense" ? "-" : "+"}₹{t.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletDetails;