import React from "react";

const CTA = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Start Managing Your Money Smarter Today
        </h2>
        
        <p className="text-gray-600 mb-6">
          Join thousands of users taking control of their finances with AI-powered insights
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg">
            Get Started Free
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-400 hover:text-blue-600 transition-all">
            View Pricing
          </button>
        </div>
        
        <p className="text-gray-500 text-sm mt-4">
          Free forever • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CTA;