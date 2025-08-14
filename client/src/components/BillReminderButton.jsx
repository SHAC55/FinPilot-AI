import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BillReminderButton = ({  }) => {
  
  const navigate =  useNavigate()

  return (
    <button
      onClick={() => navigate('/bills')}
      className="flex items-center justify-center gap-2 px-5 py-2.5 
                 bg-gradient-to-r from-indigo-500 to-purple-500 
                 text-white font-medium rounded-xl 
                 shadow-md hover:shadow-lg 
                 hover:scale-[1.03] active:scale-[0.98]
                 transition-all duration-200 ease-in-out h-[170px] w-[300px] m-3"
    >
      <Bell className="w-5 h-5" />
      Bill Reminder
    </button>
  );
};

export default BillReminderButton;
