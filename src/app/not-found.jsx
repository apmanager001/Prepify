"use client";

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
        </div>

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Main Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Looks like this study material got lost in the library. Don't worry,
          we'll help you find your way back to ace your prep!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Popular Pages
          </h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/#mission"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Our Mission
            </Link>
            <Link
              href="/#faq"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/#contact"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/#getStarted"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-20 blur-lg"></div>
      </div>
    </div>
  );
};

export default NotFound;
