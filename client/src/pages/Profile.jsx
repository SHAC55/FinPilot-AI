import React from "react";
import { useContext } from "react";
import { AppContext } from "../context/appContext";


const Profile = () => {

  const { logout  }  = useContext(AppContext)
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h1 className="text-lg font-semibold text-gray-700">
            No profile data found
          </h1>
          <p className="text-sm text-gray-500">Please log in to view profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            {user.username}
          </h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* User Info */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Full Name</span>
            <span className="text-gray-800 font-semibold">
              {user.username}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="text-gray-800 font-semibold">{user.email}</span>
          </div>
          {/* Add more fields here if needed */}
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button 
            onClick={logout}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition-all">
            Logout
          </button>
        </div>
      </div>

      
    </div>
  );
};

export default Profile;