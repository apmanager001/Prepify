"use client";

import React, { useState } from "react";
import {
  FileText,
  Edit3,
  Save,
  Download,
  Share2,
  Bookmark,
  Plus,
  Search,
} from "lucide-react";

const BottomViewer = ({ selectedGuide }) => {
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock PDF content - in real app this would be actual PDF content
  const mockPdfContent = selectedGuide
    ? `
    ${selectedGuide.title}
    
    Table of Contents
    1. Introduction
    2. Core Concepts
    3. Examples
    4. Practice Problems
    5. Summary
    
    Chapter 1: Introduction
    
    Welcome to ${
      selectedGuide.subject
    }! This comprehensive guide will take you through the fundamental concepts and advanced topics in ${selectedGuide.subject.toLowerCase()}.
    
    Learning Objectives:
    • Understand basic principles
    • Apply concepts to real-world problems
    • Develop problem-solving skills
    • Prepare for advanced studies
    
    Chapter 2: Core Concepts
    
    The foundation of ${
      selectedGuide.subject
    } lies in understanding these key concepts:
    
    • Fundamental principles
    • Mathematical relationships
    • Practical applications
    • Common misconceptions
    
    Chapter 3: Examples
    
    Let's work through some examples to solidify your understanding:
    
    Example 1: Basic Application
    Problem: [Sample problem statement]
    Solution: [Step-by-step solution]
    
    Example 2: Advanced Application
    Problem: [Complex problem statement]
    Solution: [Detailed solution with explanations]
    
    Chapter 4: Practice Problems
    
    Now it's your turn! Try these problems:
    
    1. [Practice problem 1]
    2. [Practice problem 2]
    3. [Practice problem 3]
    
    Chapter 5: Summary
    
    In this guide, we've covered:
    • Key concepts and principles
    • Practical examples and applications
    • Problem-solving strategies
    • Next steps for continued learning
    
    Remember: Practice makes perfect! Continue working through problems and applying these concepts.
  `
    : "";

  const handleSaveNotes = () => {
    // In real app, save notes to backend
    console.log("Saving notes:", notes);
    setIsEditing(false);
  };

  const handleDownload = () => {
    // In real app, download the study guide
    console.log("Downloading:", selectedGuide?.title);
  };

  const handleShare = () => {
    // In real app, share the study guide
    console.log("Sharing:", selectedGuide?.title);
  };

  if (!selectedGuide) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Study Guide Selected
          </h3>
          <p className="text-gray-500">
            Choose a study guide from the carousel above to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left Section - PDF Viewer (2/3 of width) */}
      <div className="w-2/3 bg-white border-r border-gray-200 flex flex-col">
        {/* PDF Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedGuide.title}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedGuide.subject} • {selectedGuide.level}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Bookmark"
            >
              <Bookmark className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search within the document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                {mockPdfContent}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Notes (1/3 of width) */}
      <div className="w-1/3 bg-gray-50 flex flex-col">
        {/* Notes Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Study Notes</h3>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <button
                onClick={handleSaveNotes}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                title="Save Notes"
              >
                <Save className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit Notes"
              >
                <Edit3 className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Notes Content */}
        <div className="flex-1 p-4">
          {isEditing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Start taking notes here...\n\n• Key concepts to remember\n• Important formulas\n• Questions to review\n• Personal insights"
              className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          ) : (
            <div className="h-full">
              {notes ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-full overflow-auto">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800">
                    {notes}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Edit3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">No notes yet</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Start taking notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {notes.length} characters
            </span>
            <button className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-medium">
              <Plus className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomViewer;
