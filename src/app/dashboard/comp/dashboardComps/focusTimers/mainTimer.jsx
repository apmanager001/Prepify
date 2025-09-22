import React from "react";
import { Plus } from "lucide-react";
import IndTimer from "./indTimer";

const MainTimer = () => {
  const indTimer = [
    { name: "Timer 1", duration: "25:00" },
    { name: "Timer 2", duration: "15:00" },
    { name: "Timer 3", duration: "30:00" },
    { name: "Timer 4", duration: "10:00" },
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
        {indTimer.map((timer, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-primary to-secondary rounded-2xl h-40 w-40 shadow-xl flex flex-col items-center justify-center text-2xl font-bold cursor-pointer hover:shadow-2xl hover:ring-2 hover:ring-accent transition-all duration-300"
          >
            <IndTimer timer={timer} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainTimer;
