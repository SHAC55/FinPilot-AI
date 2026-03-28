import React, { use } from "react";
import {
  AiOutlineSearch,
  AiOutlineClear,
  AiOutlineCalendar,
  AiOutlineTag,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { Plus, Filter, X } from "lucide-react";
import { MdOutlineCategory, MdOutlineDateRange } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const TransactionFilterHeader = ({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  dateFilter,
  setDateFilter,
  monthFilter,
  setMonthFilter,
  yearFilter,
  setYearFilter,
}) => {
  const currentYear = new Date().getFullYear();
  const hasActiveFilters =
    search || typeFilter !== "all" || dateFilter || monthFilter || yearFilter;

  // Get active filters count
  const activeFiltersCount = [
    search && "search",
    typeFilter !== "all" && "type",
    dateFilter && "date",
    monthFilter && "month",
    yearFilter && "year",
  ].filter(Boolean).length;

  const  navigate =  useNavigate();

  return (
    <div className="bg-blue-600 border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Section - Title & Search */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Transactions
              </h1>
              <p className="text-gray-200 text-sm mt-1">
                Manage and track all your financial activities
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-lg">
              <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by title, category, or description..."
                className="w-full pl-11 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Section - Actions & Filters */}
          <div className="flex flex-col items-stretch lg:items-end gap-4">
            {/* Add Transaction Button */}
            
            <button onClick={() => navigate("/addtransaction")} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-blue-100 text-blue-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>

            {/* Filter Section */}
            <div className="space-y-3">
              {/* Filter Header */}
              <div className="flex items-center justify-between lg:justify-end gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-white" />
                  <span className="text-xs font-medium text-white uppercase tracking-wider">
                    Filters
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-900 text-white text-xs rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setTypeFilter("all");
                      setDateFilter("");
                      setMonthFilter("");
                      setYearFilter("");
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                  >
                    <AiOutlineClear className="text-sm" />
                    Clear all
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Type Filter */}
                <div className="relative">
                  <select
                    className="pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none cursor-pointer text-gray-700"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <AiOutlineTag className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <input
                    type="date"
                    className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-700"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setMonthFilter("");
                      setYearFilter("");
                    }}
                  />
                  <AiOutlineCalendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                </div>

                {/* Month Filter */}
                <div className="relative">
                  <input
                    type="month"
                    className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-700"
                    value={monthFilter}
                    onChange={(e) => {
                      setMonthFilter(e.target.value);
                      setDateFilter("");
                    }}
                  />
                  <MdOutlineDateRange className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                </div>

                {/* Year Filter */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Year"
                    className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-24 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-700 placeholder:text-gray-400"
                    value={yearFilter}
                    onChange={(e) => {
                      setYearFilter(e.target.value);
                      setDateFilter("");
                    }}
                    min="2000"
                    max={currentYear + 5}
                  />
                  <AiOutlineClockCircle className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                </div>
              </div>

              {/* Active Filters Tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {search && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                      <AiOutlineSearch className="text-xs" />
                      <span className="max-w-[150px] truncate">{search}</span>
                      <button
                        onClick={() => setSearch("")}
                        className="ml-0.5 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {typeFilter !== "all" && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                      <AiOutlineTag className="text-xs" />
                      <span>{typeFilter === "income" ? "Income" : "Expense"}</span>
                      <button
                        onClick={() => setTypeFilter("all")}
                        className="ml-0.5 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {dateFilter && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                      <AiOutlineCalendar className="text-xs" />
                      <span>
                        {new Date(dateFilter).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => setDateFilter("")}
                        className="ml-0.5 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {monthFilter && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                      <MdOutlineDateRange className="text-xs" />
                      <span>
                        {new Date(monthFilter + "-01").toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => setMonthFilter("")}
                        className="ml-0.5 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {yearFilter && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                      <AiOutlineClockCircle className="text-xs" />
                      <span>{yearFilter}</span>
                      <button
                        onClick={() => setYearFilter("")}
                        className="ml-0.5 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilterHeader;