import { Bell, PlusCircle, Users } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const QuickButtonDash = () => {
  const navigate = useNavigate();

  const buttons = [
    {
      label: "Bill Reminder",
      icon: <Bell className="w-5 h-5 md:w-6 md:h-6" />,
      gradient: "from-indigo-500 to-purple-500",
      route: "/bills",
    },
    {
      label: "Split Bill",
      icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,
      gradient: "from-blue-500 to-indigo-600",
      route: "/split",
    },
    {
      label: "Add Transaction",
      icon: <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />,
      gradient: "from-cyan-500 to-violet-500",
      route: "/transaction-form",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6 px-4">
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          onClick={() => navigate(btn.route)}
          className={`flex flex-col items-center justify-center gap-3 
                      px-6 py-8 rounded-2xl 
                      bg-gradient-to-r ${btn.gradient}
                      text-white font-semibold text-lg
                      shadow-md hover:shadow-xl
                      transform hover:scale-[1.03] active:scale-[0.97]
                      transition-all duration-200 ease-in-out
                      backdrop-blur-sm  h-[180px] min-w-[250px]`}
        >
          {btn.icon}
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickButtonDash;
