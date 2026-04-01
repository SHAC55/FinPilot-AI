import React from "react";

const Footer = () => {
  const quickLinks = ["Features", "Pricing", "About", "Contact"];
  const legalLinks = ["Privacy", "Terms", "Security"];

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">FinPilot AI</h3>
            <p className="text-sm text-gray-500">
              Smart financial management powered by AI
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Get in Touch</h4>
            <p className="text-sm text-gray-500 mb-2">support@finpilot.ai</p>
            <p className="text-sm text-gray-500">1-800-FIN-PILOT</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2026 FinPilot AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;