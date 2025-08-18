import React, { useContext } from 'react';
import { CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContext';

const CompletedSplitButton = () => {

  

    const navigate = useNavigate()

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 h-[170px] flex flex-col justify-between">
      
      {/* Top Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Completed Splits</h2>
        </div>

        <p className="text-sm text-gray-600 leading-snug">
          <span className="font-bold text-green-700">1</span> completed this month.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
          98% On-Time
        </span>

        <button
        onClick={()  => navigate('/completedsplits')  }
        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200">
          View
        </button>
      </div>
    </div>
  );
};

export default CompletedSplitButton;
