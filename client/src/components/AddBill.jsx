import React from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddBill = () => {

    const naviagte  =  useNavigate()
  return (
    <button
    onClick={() => naviagte('/add-bill')}
      className="flex items-center justify-center
     gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-md md:h-[170px] h-[100px] md:w-[300px] w-[370px] hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
    >
      <PlusCircle className="w-5 h-5" />
      Add Bill
    </button>
  );
};

export default AddBill;
