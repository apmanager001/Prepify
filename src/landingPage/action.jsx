"use client";

import { useState, useEffect } from "react";

const Action = () => {
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const fullText =
    "Your ultimate preparation companion for mastering any exam. We provide intelligent tools and comprehensive study materials designed to help you succeed. Our AI-powered system adapts to your learning style and provides personalized study plans that maximize your efficiency. Track your progress, identify weak areas, and focus on what matters most. Access hundreds of practice questions, detailed explanations, and expert-curated content across multiple subjects and exam types. From standardized tests to professional certifications, we've got you covered. Students using our platform see an average improvement of 25% in their scores within the first month of study. Join the success stories and ace your next exam with confidence. Sign up for free and experience the difference that intelligent preparation makes. No credit card required. Start your journey to academic and professional success with Prepify. Our team of education experts and AI specialists work together to create the most effective learning experience possible. Get personalized guidance and support whenever you need it. Our platform learns from your performance and adapts the content to match your unique learning pace and style. No more one-size-fits-all approaches to studying. Monitor your progress with detailed analytics and insights that help you understand your strengths and areas for improvement. Data-driven learning for better results. Thousands of practice questions with instant feedback. Access your study materials on any device, anytime. Join thousands of students who have transformed their learning experience with our platform.";

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible
    );

    const element = document.getElementById("getStarted");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Progress bar animation - only starts when in view
  useEffect(() => {
    if (!isInView) return;

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
  }, [isInView]);

  // Typing animation effect - only starts when in view
  useEffect(() => {
    if (!isInView) return;

    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 10); // Fast typing speed - 10ms per character

      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText, isInView]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log("Newsletter subscription:", email);
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 min-h-screen overflow-hidden"
      id="getStarted"
    >
      {/* Blurred background text */}
      <div className="relative inset-0 opacity-50 z-10">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full px-10 max-w-4xl z-10">
          <h2 className="text-white text-3xl font-bold mb-6 blur-sm select-none">
            Welcome to Prepify
          </h2>
          <p className="text-white text-lg blur-sm select-none leading-[3.0rem]">
            {displayText}
            <span className="animate-pulse">|</span>
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
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Your Study Tools Are Coming to Life
            </h2>
            <h3 className="text-lg md:text-xl font-semibold text-white/60 mb-4">
              We&apos;re building features that will transform how you prepare —
              and you can be among the first to try them.
            </h3>
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
                <p className="animate-pulse">
                  Sorting materials custom for you...
                </p>
              )}
              {progress >= 75 && progress < 100 && (
                <p className="animate-pulse">Almost ready...</p>
              )}
              {progress === 100 && (
                <button className="text-green-400 font-semibold">
                  Your Study Guide is Ready!
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 md:mt-12 max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-3 text-center">
              Sign up for our Weekly Study Boost newsletter to get:
            </h3>
            <div className="flex justify-center text-white/80 text-sm mb-4 text-left">
              <ol className="text-left list-disc list-inside text-white/60">
                <li>Science-backed focus techniques</li>
                <li>The best free online resources for test prep</li>
                <li>Simple tips to study smarter and manage stress</li>
              </ol>
            </div>
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
