import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate }  from 'react-router-dom'

const GoalsHeader = () => {

    const navigate = useNavigate()
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg text-white m-4">
      
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
        Set, Track, and Smash Your Finance Goals with{" "}
        <span className="text-yellow-300">AI</span>
      </h1>

      {/* Add Goal Button */}
      <button onClick={() => navigate('/addgoal')} 
      className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300">
        <Plus size={20} />
        Add Goal
      </button>

    </div>
  );
};

export default GoalsHeader;
