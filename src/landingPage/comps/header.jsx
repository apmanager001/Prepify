"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window !== "undefined") {
        const userId = localStorage.getItem("userId");
        setIsLoggedIn(!!userId);
      }
    };

    // Check initial status
    checkLoginStatus();

    // Listen for storage changes (when user logs in/out from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "userId") {
        checkLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Navigation links array - single source of truth
  const navigationLinks = [
    { href: "#home", label: "Home" },
    { href: "#getStarted", label: "Get Started" },
    { href: "#mission", label: "Mission" },
    { href: "#faq", label: "FAQ" },
    { href: "#donations", label: "Donate" },
    { href: "#contact", label: "Contact" },
  ];

  const loginLink = (
    <div>
      {isLoggedIn ? (
        <Link
          href="/dashboard"
          className="btn bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-base lg:text-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href="/login"
          className="btn bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-base lg:text-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          Login
        </Link>
      )}
    </div>
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <Image
                src="/logoNoSlogan.webp"
                alt="Prepify"
                width={140}
                height={140}
                className="w-24 h-24 lg:w-32 lg:h-32"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm xl:text-base 2xl:text-lg font-bold transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            <div className="ml-2">{loginLink}</div>
          </nav>

          {/* Tablet Navigation (simplified) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-3">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-gray-700 hover:text-blue-600 px-1 py-2 text-sm font-bold transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            <div className="ml-2">{loginLink}</div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigationLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2">{loginLink}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
