import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { AiFillDelete, AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { MdOutlineAccountBalanceWallet, MdOutlineCategory, MdOutlineDateRange } from "react-icons/md";
import { AppContext } from "../context/appContext";
import TransactionFilterHeader from "../components/TransactionFilterHeader";

const TransactionTable = () => {
  const { expenses, setExpenses, deleteItem, URL } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAllExpenses = async () => {
      try {
        const res = await axios.get(`${URL}/transaction/get-expenses`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setExpenses(res.data.data || []);
      } catch (err) {
        setError("Unable to fetch expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllExpenses();
  }, []);

  // Filtering Logic
  const filteredExpenses = useMemo(() => {
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    };

    return expenses.filter((e) => {
      const titleMatch = e.title.toLowerCase().includes(search.toLowerCase());
      const typeMatch = typeFilter === "all" || e.type === typeFilter;

      const expenseDate = new Date(e.date);

      const dateMatch = dateFilter
        ? formatDate(e.date) === dateFilter
        : true;

      const monthMatch = monthFilter
        ? `${expenseDate.getFullYear()}-${String(
            expenseDate.getMonth() + 1
          ).padStart(2, "0")}` === monthFilter
        : true;

      const yearMatch = yearFilter
        ? expenseDate.getFullYear().toString() === yearFilter
        : true;

      return (
        titleMatch && typeMatch && dateMatch && monthMatch && yearMatch
      );
    });
  }, [expenses, search, typeFilter, dateFilter, monthFilter, yearFilter]);

  // Pagination Logic
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [filteredExpenses, currentPage]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, dateFilter, monthFilter, yearFilter]);

  // Get summary statistics
  const summary = useMemo(() => {
    const totalIncome = filteredExpenses
      .filter(e => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = filteredExpenses
      .filter(e => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;
    
    return { totalIncome, totalExpense, balance };
  }, [filteredExpenses]);

  return (
    <div className="w-full  ">

      <div className="">
           {/* Filters Section */}
          <TransactionFilterHeader
            search={search}
            setSearch={setSearch}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
          />
        </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
     
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredExpenses.length > 0 ? (
          <>
          
            {/* Table - Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm font-semibold">
                              {expense.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{expense.title}</p>
                            <p className="text-xs text-gray-500">{expense.description || 'No description'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={`font-bold ${expense.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {expense.type === "income" ? "+" : "-"} ₹{expense.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          expense.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {expense.type === "income" ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(expense.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm capitalize">
                        {expense.method.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            deleteItem(
                              "transaction/delete-expense",
                              expense._id,
                              setExpenses
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <AiFillDelete className="text-red-400 hover:text-red-600 text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {paginatedExpenses.map((expense) => (
                <div key={expense._id} className="p-4 hover:bg-blue-50/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {expense.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{expense.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(expense.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        deleteItem(
                          "transaction/delete-expense",
                          expense._id,
                          setExpenses
                        )
                      }
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <AiFillDelete className="text-red-400 text-lg" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        expense.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {expense.type === "income" ? "Income" : "Expense"}
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        {expense.category}
                      </span>
                    </div>
                    <p className={`font-bold text-lg ${expense.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {expense.type === "income" ? "+" : "-"} ₹{expense.amount.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Method: <span className="capitalize text-gray-600">{expense.method.replace('_', ' ')}</span>
                    </p>
                    {expense.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        Note: {expense.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500 order-2 sm:order-1">
                    Page {currentPage} of {totalPages}
                  </p>
                  
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <FiChevronsLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <FiChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-9 h-9 rounded-lg font-medium text-sm transition ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white shadow-sm"
                                : "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <FiChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <FiChevronsRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AiOutlineSearch className="text-gray-400 text-3xl" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No transactions found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters or add a new transaction</p>
            </div>
          </div>
          
        )}
      </div>
      <div className="px-6 py-3 bg-gray-50/30 border-b border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {paginatedExpenses.length} of {filteredExpenses.length} transactions
              </p>
            </div>
    </div>
  );
};

export default TransactionTable;