"use client";

import React, { useState } from "react";
import TopCarousel from "./comp/TopCarousel";
import BottomViewer from "./comp/BottomViewer";

const StudyGuides = () => {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isTopCollapsed, setIsTopCollapsed] = useState(false);

  const handleGuideSelect = (guide) => {
    setSelectedGuide(guide);
  };

  const toggleTopSection = () => {
    setIsTopCollapsed(!isTopCollapsed);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Section - Carousel (1/4 of page) */}
      <div
        className={`${
          isTopCollapsed ? "h-16" : "h-1/4"
        } transition-all duration-300 ease-in-out`}
      >
        <TopCarousel
          onGuideSelect={handleGuideSelect}
          isCollapsed={isTopCollapsed}
          onToggle={toggleTopSection}
        />
      </div>

      {/* Bottom Section - PDF Viewer with Notes (3/4 of page) */}
      <div className="flex-1">
        <BottomViewer selectedGuide={selectedGuide} />
      </div>
    </div>
  );
};

export default StudyGuides;
