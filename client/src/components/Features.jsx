import React from "react";
import {
  TrendingUp,
  Brain,
  Users,
  Target,
  Wallet,
  Bell,
  Mail,
  BookOpen,
  LineChart,
  Calendar,
  PiggyBank,
  Share2,
} from "lucide-react";


const features = [
  {
    title: "Track Transactions",
    desc: "Add and track all your income & expenses in real-time. Categorize transactions and view detailed history.",
    icon: TrendingUp,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "AI Expense Insights",
    desc: "Get intelligent analysis of your spending patterns. AI identifies saving opportunities and alerts you to unusual expenses.",
    icon: Brain,
    color: "from-purple-500 to-blue-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Interactive Dashboard",
    desc: "Visualize your financial health with beautiful charts and graphs. Track net worth, cash flow, and spending trends.",
    icon: LineChart,
    color: "from-green-500 to-blue-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Smart Wallet System",
    desc: "Create multiple wallets for different purposes. Track balances across cash, bank accounts, and digital wallets.",
    icon: Wallet,
    color: "from-orange-500 to-blue-600",
    bgColor: "bg-orange-50",
  },
  // {
  //   title: "Budget Limits",
  //   desc: "Set custom spending limits per category. Get real-time alerts when approaching or exceeding your budget.",
  //   icon: Bell,
  //   color: "from-red-500 to-blue-600",
  //   bgColor: "bg-red-50",
  // },
  {
    title: "Financial Goals",
    desc: "Plan and track your financial goals. Set target amounts, deadlines, and monitor progress with visual indicators.",
    icon: Target,
    color: "from-teal-500 to-blue-600",
    bgColor: "bg-teal-50",
  },
  {
    title: "AI Goal Assistant",
    desc: "Get AI-powered recommendations to reach your goals faster. Personalized saving strategies and timeline predictions.",
    icon: PiggyBank,
    color: "from-pink-500 to-blue-600",
    bgColor: "bg-pink-50",
  },
  {
    title: "Split Bills",
    desc: "Easily split expenses with friends and family. Calculate shares, track who owes what, and settle up seamlessly.",
    icon: Users,
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50",
  },
  // {
  //   title: "Email Reminders",
  //   desc: "Automated email reminders for bill splits, due dates, and budget alerts. Never miss a payment again.",
  //   icon: Mail,
  //   color: "from-cyan-500 to-blue-600",
  //   bgColor: "bg-cyan-50",
  // },
  {
    title: "Ledger System",
    desc: "Complete double-entry accounting system. Track every transaction with detailed notes, receipts, and audit trail.",
    icon: BookOpen,
    color: "from-amber-500 to-blue-600",
    bgColor: "bg-amber-50",
  },
  
];

const Features = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Master Your Finances
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our comprehensive suite of financial tools designed to help you take control of your money with AI-powered intelligence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {/* Icon Container */}
                <div className={`${feature.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                 <Icon className="w-7 h-7 text-gray-700 group-hover:text-blue-600 transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {feature.desc}
                </p>

                {/* Hover Indicator */}
                <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* <span className="text-sm font-medium">Learn more</span> */}
                  {/* <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg> */}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600 text-sm">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">$12M+</div>
            <div className="text-gray-600 text-sm">Money Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600 text-sm">User Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600 text-sm">AI Support</div>
          </div>
        </div>

        {/* CTA Banner */}
        {/* <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Financial Life?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of users who are already saving money and reaching their financial goals with our AI-powered platform.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Start Your Free Trial
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default Features;