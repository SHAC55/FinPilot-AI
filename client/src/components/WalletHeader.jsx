import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from 'lucide-react';

const WalletHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 bg-blue-600">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white">
          Stay on budget, across every{' '}
          <span className="font-medium  border-b-2 border-blue-400 text-yellow-100 pb-0.5">
            wallet
          </span>
          .
        </h1>
        
        <button
          onClick={() => navigate("/addwallet")}
          className="flex items-center gap-2 text-blue-600 hover:text-gray-900 transition-colors bg-white p-2 rounded-md duration-200 text-sm sm:text-base font-medium group"
        >
          <Plus size={18} className="group-hover:scale-110 transition-transform duration-200" />
          Add Wallet
        </button>
      </div>
    </div>
  );
};

export default WalletHeader;