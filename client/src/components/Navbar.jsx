import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const navLinkStyle = ({ isActive }) =>
    `transition duration-200 ${
      isActive ? "text-yellow-300" : "text-white"
    } hover:text-yellow-300`;

  return (
    <div className="bg-blue-600 text-white px-6 py-4  sticky top-0 z-50">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          FinPilot AI
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <NavLink to="/" className={navLinkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/transaction" className={navLinkStyle}>
            Transaction
          </NavLink>
          <NavLink to="/plan-goal" className={navLinkStyle}>
            Plan Goal
          </NavLink>
          <NavLink to="/wallet" className={navLinkStyle}>
            Wallet
          </NavLink>
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 border border-white/30 px-3 py-1.5 rounded-lg hover:bg-white hover:text-blue-700 transition duration-200"
          >
            {/* Avatar */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-blue-700 font-bold uppercase">
              {user?.username?.charAt(0) || "U"}
            </div>

            {/* Username */}
            <span className="font-medium">{user?.username || "USER"}</span>
          </NavLink>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 mt-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-4 font-medium bg-blue-600 p-4 rounded-xl shadow-lg">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={navLinkStyle}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/transaction"
            onClick={() => setIsOpen(false)}
            className={navLinkStyle}
          >
            Transaction
          </NavLink>

          <NavLink
            to="/plan-goal"
            onClick={() => setIsOpen(false)}
            className={navLinkStyle}
          >
            Plan Goal
          </NavLink>

          <NavLink
            to="/wallet"
            onClick={() => setIsOpen(false)}
            className={navLinkStyle}
          >
            Wallet
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 border-t pt-3"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-blue-700 font-bold uppercase">
              {user?.username?.charAt(0) || "U"}
            </div>

            <span className="font-medium">{user?.username || "USER"}</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
