import React from "react";
import { ArrowRight, Play, TrendingUp, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {

  const navigate =  useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white pt-20 pb-32 px-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Finpilot AI : <span className="text-black">Smart Finance Management</span></span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              Take Control of Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Money
                </span>
                <svg
                  className="absolute bottom-2 left-0 w-full h-3 -z-0"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 8 L200 8"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              with <span className="text-blue-600">AI-Powered</span> Insights
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Track expenses, split bills, and get intelligent financial insights — all in one secure, intuitive platform. Join 50,000+ users taking control of their financial future.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>Smart Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Real-time Sync</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() =>  navigate("/register")} className="group bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              {/* <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2 bg-white">
                <Play className="w-5 h-5" />
                Watch Demo
              </button> */}
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white"
                  ></div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">2,500+</span> users joined this week
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              {/* Mock Dashboard */}
              <div className="space-y-4">
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Total Balance</p>
                  <p className="text-3xl font-bold">$12,845.32</p>
                  <p className="text-xs opacity-80 mt-1">↑ 12.5% from last month</p>
                </div>

                {/* Expense Chart Mock */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Weekly Spending</span>
                    <span className="text-blue-600 font-medium">View Details →</span>
                  </div>
                  <div className="space-y-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                      <div key={day} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-8">{day}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${[65, 45, 80, 30, 70][i]}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          ${[124, 89, 156, 62, 143][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insight Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">AI Insight</p>
                      <p className="text-xs text-gray-600">
                        You spent 23% less on dining out this month. Great job! 🎉
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;