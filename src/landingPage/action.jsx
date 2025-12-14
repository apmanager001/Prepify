"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter } from "@/lib/api";

const Action = () => {
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const fullText =
    "Your ultimate preparation companion for mastering any exam. We provide intelligent tools and comprehensive study materials designed to help you succeed. Our AI-powered system adapts to your learning style and provides personalized study plans that maximize your efficiency. Track your progress, identify weak areas, and focus on what matters most. Access hundreds of practice questions, detailed explanations, and expert-curated content across multiple subjects and exam types. From standardized tests to professional certifications, we've got you covered. Students using our platform see an average improvement of 25% in their scores within the first month of study. Join the success stories and ace your next exam with confidence. Sign up for free and experience the difference that intelligent preparation makes. No credit card required. Start your journey to academic and professional success with Prepify. Our team of education experts and AI specialists work together to create the most effective learning experience possible. Get personalized guidance and support whenever you need it. Our platform learns from your performance and adapts the content to match your unique learning pace and style. No more one-size-fits-all approaches to studying. Monitor your progress with detailed analytics and insights that help you understand your strengths and areas for improvement. Data-driven learning for better results. Thousands of practice questions with instant feedback. Access your study materials on any device, anytime. Join thousands of students who have transformed their learning experience with our platform.";

  // Newsletter subscription mutation
  const newsletterMutation = useMutation({
    mutationFn: subscribeToNewsletter,
    onSuccess: (data) => {
      console.log("Newsletter subscription successful:", data);
      // Reset form on success
      setEmail("");
      // You could add a toast notification here
    },
    onError: (error) => {
      console.error("Newsletter subscription failed:", error);
      // You could add error toast notification here
    },
  });

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
      newsletterMutation.mutate({ email });
    }
  };

  return (
    <div
      className="bg-linear-to-br from-primary/10 via-secondary/5 to-primary/15 min-h-screen overflow-hidden relative"
      id="getStarted"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Blurred background text */}
      <div className="relative inset-0 opacity-100 z-10 py-10">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full px-10 max-w-4xl z-10">
          <h2 className="text-primary/60 text-3xl font-bold mb-6 blur-sm select-none">
            Welcome to Prepify
          </h2>
          <p className="text-secondary/60 text-lg blur-sm select-none leading-[3.0rem]">
            {displayText}
            <span className="animate-pulse text-primary/40">|</span>
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Progress Box */}
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-96 w-full border border-white/30 shadow-2xl relative overflow-hidden group hover:shadow-primary/20 transition-all duration-500">
          {/* linear overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="text-center relative z-10">
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 bg-linear-to-r from-primary to-secondary bg-clip-text">
              Your Study Tools Are Coming to Life
            </h2>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-6">
              We&apos;re building features that will transform how you prepare —
              and you can be among the first to try them.
            </h3>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-white/30 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
                <div
                  className="bg-linear-to-r from-primary via-secondary to-primary h-4 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  Loading...
                </span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
            </div>

            {/* Status Messages */}
            <div className="text-gray-700 text-sm space-y-3">
              {progress < 25 && (
                <div className="animate-pulse flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Initializing application...
                </div>
              )}
              {progress >= 25 && progress < 50 && (
                <div className="animate-pulse flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Loading study materials...
                </div>
              )}
              {progress >= 50 && progress < 75 && (
                <div className="animate-pulse flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Sorting materials custom for you...
                </div>
              )}
              {progress >= 75 && progress < 100 && (
                <div className="animate-pulse flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Almost ready...
                </div>
              )}
              {progress === 100 && (
                <button className="text-green-500 font-bold flex items-center justify-center gap-2 mx-auto bg-green-100 px-4 py-2 rounded-full shadow-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  Your Study Guide is Ready!
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="my-8 md:my-12 max-w-md w-full">
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl relative overflow-hidden group hover:shadow-secondary/20 transition-all duration-500">
            {/* linear overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-primary mb-4 text-center bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Sign up for our Weekly Study Boost newsletter to get:
              </h3>
              <div className="mb-6">
                <ol className="text-left space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    <span>Science-backed focus techniques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                    <span>The best free online resources for test prep</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    <span>Simple tips to study smarter and manage stress</span>
                  </li>
                </ol>
              </div>

              {/* Success Message */}
              {newsletterMutation.isSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-green-800 text-sm font-medium">
                      Successfully subscribed to newsletter!
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {newsletterMutation.isError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-red-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <p className="text-red-800 text-sm font-medium">
                      {newsletterMutation.error?.message ||
                        "Failed to subscribe. Please try again."}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    autoComplete="email"
                    disabled={newsletterMutation.isPending}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 bg-linear-to-r from-primary to-secondary rounded-full opacity-60"></div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={newsletterMutation.isPending}
                  className="w-full bg-linear-to-r from-primary to-secondary text-white py-4 px-6 rounded-xl font-bold hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {newsletterMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">
                        Subscribe to Newsletter
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Action;
