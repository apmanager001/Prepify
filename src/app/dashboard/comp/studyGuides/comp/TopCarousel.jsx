"use client";

import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const TopCarousel = ({ onGuideSelect, isCollapsed, onToggle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock study guide data with placeholder images
  const studyGuides = [
    {
      id: 1,
      title: "Mathematics Fundamentals",
      subject: "Math",
      level: "Beginner",
      image: "/placeholder-math.jpg",
      description: "Core mathematical concepts and problem-solving strategies",
    },
    {
      id: 2,
      title: "Physics Principles",
      subject: "Physics",
      level: "Intermediate",
      image: "/placeholder-physics.jpg",
      description: "Fundamental physics laws and their applications",
    },
    {
      id: 3,
      title: "Chemistry Basics",
      subject: "Chemistry",
      level: "Beginner",
      image: "/placeholder-chemistry.jpg",
      description:
        "Introduction to chemical reactions and molecular structures",
    },
    {
      id: 4,
      title: "Biology Essentials",
      subject: "Biology",
      level: "Intermediate",
      image: "/placeholder-biology.jpg",
      description: "Cell biology, genetics, and evolutionary concepts",
    },
    {
      id: 5,
      title: "History Timeline",
      subject: "History",
      level: "Advanced",
      image: "/placeholder-history.jpg",
      description: "Major historical events and their significance",
    },
    {
      id: 6,
      title: "Literature Analysis",
      subject: "English",
      level: "Intermediate",
      image: "/placeholder-literature.jpg",
      description: "Critical reading and literary analysis techniques",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % studyGuides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + studyGuides.length) % studyGuides.length
    );
  };

  const handleGuideClick = (guide) => {
    onGuideSelect(guide);
  };

  if (isCollapsed) {
    return (
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold text-gray-800">
            Study Guides
          </span>
          <span className="text-sm text-gray-500">
            ({studyGuides.length} available)
          </span>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Study Guides</h2>
            <p className="text-gray-600">Select a guide to start studying</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronUp className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Carousel Container */}
        <div className="flex space-x-6 overflow-hidden px-12 py-4">
          {studyGuides.map((guide, index) => (
            <div
              key={guide.id}
              onClick={() => handleGuideClick(guide)}
              className={`flex-shrink-0 w-48 h-52 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                index === currentIndex
                  ? "border-primary shadow-lg"
                  : "hover:border-primary/50"
              }`}
            >
              {/* Placeholder Image */}
              <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-xs text-gray-600">{guide.subject}</span>
                </div>
              </div>

              {/* Guide Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                  {guide.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{guide.level}</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    {guide.subject}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {studyGuides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCarousel;
