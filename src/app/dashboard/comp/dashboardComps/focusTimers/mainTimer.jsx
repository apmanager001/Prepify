'use client'
import React from "react";
import { Plus } from "lucide-react";
import IndTimer from "./indTimer";

const MainTimer = () => {
  const indTimer = [
    { name: "Timer 1", duration: "25:00" },
    { name: "Timer 2", duration: "15:00" },
    
  ];

  return (
    <div className="flex flex-col mt-10">
      <div className="flex justify-between items-center mb-4 w-full">
        <h3 className="text-xl font-bold">Focus Timer</h3>
        <div>
          <button className="btn btn-sm btn-primary rounded-lg mx-2">
            <Plus /> New
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center gap-24 flex-wrap">
        {[...indTimer.slice(0, 4), ...Array(4 - indTimer.length).fill(null)]
          .slice(0, 4)
          .map((timer, index) => (
            <div
              key={index}
              className={`rounded-2xl h-40 w-40 shadow-xl flex flex-col items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 ${
                !timer
                  ? "bg-base-100 border-2 border-dotted border-primary"
                  : "bg-gradient-to-br from-primary to-secondary hover:shadow-2xl hover:ring-2 hover:ring-accent"
              }`}
            >
              <IndTimer timer={timer} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MainTimer;
