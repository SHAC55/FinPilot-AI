import React from "react";
import { PlusCircle, Sparkles, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Add Your Transactions",
    description:
      "Quickly log your income and expenses manually or connect your bank account for automatic syncing.",
    icon: PlusCircle,
    details: "Support for 50+ currencies and multiple payment methods",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "AI-Powered Categorization",
    description:
      "Our smart AI automatically categorizes your transactions and learns your spending patterns.",
    icon: Sparkles,
    details: "98% accuracy with custom category suggestions",
    color: "from-purple-500 to-blue-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Get Insights & Reports",
    description:
      "Receive personalized insights, track your progress, and make data-driven financial decisions.",
    icon: TrendingUp,
    details: "Real-time analytics and monthly reports",
    color: "from-green-500 to-blue-600",
    bgColor: "bg-green-50",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Get started in minutes with our intuitive 3-step process designed
            for financial clarity
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Lines - Desktop only */}
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 transform -translate-y-1/2">
            <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="absolute right-1/3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon Container */}
                  <div
                    className={`${step.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-10 h-10 text-blue-600" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-center mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details Badge */}
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">{step.details}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alternative: Mobile View with Arrows */}
        <div className="md:hidden mt-8 space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowRight className="w-5 h-5 text-blue-400 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Video Demo Section */}
        {/* <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                See It in Action
              </h3>
              <p className="text-blue-100 mb-6">
                Watch our quick demo to see how easy it is to manage your finances with AI-powered insights.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2 group">
                Watch Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-white text-sm">Demo Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">3 min</div>
            <div className="text-sm text-gray-600">Average setup time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
            <div className="text-sm text-gray-600">Free to start</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">AI assistance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">50K+</div>
            <div className="text-sm text-gray-600">Happy users</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
