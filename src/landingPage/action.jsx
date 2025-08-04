"use client";

import { useState, useEffect } from "react";

const Action = () => {
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");


  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // Here you would typically send the email to your backend
      console.log("Newsletter subscription:", email);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 min-h-screen overflow-hidden" id='getStarted'>
      {/* Blurred background text */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 max-w-md">
          <h2 className="text-white text-2xl font-bold mb-4 blur-sm select-none">
            Welcome to Prepify
          </h2>
          <p className="text-white text-lg mb-6 blur-sm select-none">
            Your ultimate preparation companion for mastering any exam. We
            provide intelligent tools and comprehensive study materials designed
            to help you succeed.
          </p>
          <p className="text-white text-base blur-sm select-none">
            Join thousands of students who have transformed their learning
            experience with our platform.
          </p>
        </div>

        <div className="absolute top-40 right-10 max-w-md">
          <h3 className="text-white text-xl font-bold mb-3 blur-sm select-none">
            Smart Study Tools
          </h3>
          <p className="text-white text-base mb-4 blur-sm select-none">
            Our AI-powered system adapts to your learning style and provides
            personalized study plans that maximize your efficiency.
          </p>
          <p className="text-white text-sm blur-sm select-none">
            Track your progress, identify weak areas, and focus on what matters
            most.
          </p>
        </div>

        <div className="absolute top-80 left-20 max-w-lg">
          <h3 className="text-white text-xl font-bold mb-3 blur-sm select-none">
            Comprehensive Materials
          </h3>
          <p className="text-white text-base mb-4 blur-sm select-none">
            Access hundreds of practice questions, detailed explanations, and
            expert-curated content across multiple subjects and exam types.
          </p>
          <p className="text-white text-sm blur-sm select-none">
            From standardized tests to professional certifications, we've got
            you covered.
          </p>
        </div>

        <div className="absolute bottom-40 right-20 max-w-md">
          <h3 className="text-white text-xl font-bold mb-3 blur-sm select-none">
            Proven Results
          </h3>
          <p className="text-white text-base mb-4 blur-sm select-none">
            Students using our platform see an average improvement of 25% in
            their scores within the first month of study.
          </p>
          <p className="text-white text-sm blur-sm select-none">
            Join the success stories and ace your next exam with confidence.
          </p>
        </div>

        <div className="absolute bottom-20 left-10 max-w-lg">
          <h3 className="text-white text-xl font-bold mb-3 blur-sm select-none">
            Get Started Today
          </h3>
          <p className="text-white text-base mb-4 blur-sm select-none">
            Sign up for free and experience the difference that intelligent
            preparation makes. No credit card required.
          </p>
          <p className="text-white text-sm blur-sm select-none">
            Start your journey to academic and professional success with
            Prepify.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Progress Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 max-w-96 w-full h-96border border-white/20 shadow-2xl">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Preparing Your Experience
            </h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-white/80">
                <span>Loading...</span>
                <span>{progress}%</span>
              </div>
            </div>

            {/* Status Messages */}
            <div className="text-white/90 text-sm space-y-2">
              {progress < 25 && (
                <p className="animate-pulse">Initializing application...</p>
              )}
              {progress >= 25 && progress < 50 && (
                <p className="animate-pulse">Loading study materials...</p>
              )}
              {progress >= 50 && progress < 75 && (
                <p className="animate-pulse">Setting up your dashboard...</p>
              )}
              {progress >= 75 && progress < 100 && (
                <p className="animate-pulse">Almost ready...</p>
              )}
              {progress === 100 && (
                <button className="text-green-400 font-semibold">Lets Go!</button>
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 md:mt-12 max-w-md w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-3 text-center">
                Stay Updated
              </h3>
              <p className="text-white/80 text-sm mb-4 text-center">
                Get important tips on how to prepare for your exams.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    required
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Subscribe to Newsletter
                </button>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Action;
