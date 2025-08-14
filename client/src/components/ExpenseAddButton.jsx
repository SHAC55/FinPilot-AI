import React from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom'


const ExpenseAddButton = () => {

  const navigate = useNavigate()
  return (
    <button
      onClick={()  =>  navigate('/transaction-form')}
      className="flex items-center justify-center gap-2 px-5 py-2.5 
                 bg-gradient-to-r from-teal-500 to-blue-500 
                 text-white font-medium rounded-xl 
                 shadow-md hover:shadow-lg 
                 hover:scale-[1.03] active:scale-[0.98]
                 transition-all duration-200 ease-in-out h-[170px] w-[300px]  m-3"
    >
      <PlusCircle className="w-5 h-5" />
      Add Transaction
    </button>
  );
};

export default ExpenseAddButton;
