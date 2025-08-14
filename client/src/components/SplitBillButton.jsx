import React from "react";
import { Users } from "lucide-react";

const SplitBillButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center  justify-center gap-2 px-5 py-2.5 
                 bg-gradient-to-r from-emerald-500 to-teal-500
                 text-white font-medium rounded-xl 
                 shadow-md hover:shadow-lg 
                 hover:scale-[1.03] active:scale-[0.98]
                 transition-all duration-200 ease-in-out h-[170px] w-[300px]  m-3"
    >
      <Users className="w-5 h-5" />
      Split Bill
    </button>
  );
};

export default SplitBillButton;
