import React from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddSplitButton = () => {

    const  navigate = useNavigate()

  return (
    <button
    onClick={() => navigate('/addsplit')}
      className="group flex  items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                 text-white rounded-2xl h-[50px] md:w-[200px] w-full hover:shadow-lg 
                 transition-all duration-300 transform hover:-translate-y-1"
    >
      <PlusCircle
        size={30}
        className="group-hover:scale-110 transition-transform duration-300"
      />
      <span className="font-semibold text-xl">Add Split</span>
    </button>
  );
};

export default AddSplitButton;
