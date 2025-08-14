import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="text-2xl font-bold tracking-wide">
            FinPilot AI
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-200">Dashboard</Link>
            <Link to="/expense" className="hover:text-gray-200">Expense</Link>
            <Link to="/split" className="hover:text-gray-200">Split</Link>
            <Link to="/plan-goal" className="hover:text-gray-200">Plan Goal</Link>
            <Link to="/archive" className="hover:text-gray-200">Archive</Link>
            <Link to="/profile" className="hover:text-gray-200">Profile</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="focus:outline-none text-white text-2xl">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-500 px-4 pb-4 space-y-2">
          <Link to="/dashboard" className="block hover:text-gray-200">Dashboard</Link>
          <Link to="/expense" className="block hover:text-gray-200">Expense</Link>
          <Link to="/split" className="block hover:text-gray-200">Split</Link>
          <Link to="/plan-goal" className="block hover:text-gray-200">Plan Goal</Link>
          <Link to="/archive" className="block hover:text-gray-200">Archive</Link>
          <Link to="/profile" className="block hover:text-gray-200">Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
