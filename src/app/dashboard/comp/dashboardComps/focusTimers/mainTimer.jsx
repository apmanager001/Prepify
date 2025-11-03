"use client";
import React, { useState } from "react";
import { useTimerQuery } from "./useTimerQuery";
import { Plus } from "lucide-react";
import IndTimer from "./indTimer";
import AddTimerModal from "./addTimer";

const MainTimer = () => {
  const { data: timerData, isLoading, isError, refetch } = useTimerQuery();
  const indTimer = Array.isArray(timerData?.timers)
    ? timerData?.timers.slice(0, 4)
    : [];

  // const indTimer = timerData.timers
  // console.log(indTimer);
  const [showModal, setShowModal] = useState(false);

  // Placeholder for timer creation logic
  const handleCreateTimer = (newTimer) => {
    // After timer is created, refetch timers
    setShowModal(false);
    refetch();
  };
  return (
    <div className="flex flex-col mt-10">
      <div className="flex justify-between items-center mb-4 w-full">
        <h3 className="text-xl font-bold">Focus Timer</h3>
        <div>
          <button
            className="btn btn-sm btn-primary rounded-lg mx-2"
            onClick={() => setShowModal(true)}
          >
            <Plus /> New
          </button>
        </div>
      </div>
      <AddTimerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateTimer}
      />
      <div className="flex justify-center items-center gap-12 flex-wrap">
        {isLoading && <div className="text-gray-500">Loading timers...</div>}
        {isError && <div className="text-red-500">Error loading timers.</div>}
        {!isLoading &&
          !isError &&
          [...indTimer, ...Array(5 - indTimer.length).fill(null)].map(
            (timer, index) => (
              <div
                key={index}
                className={`relative rounded-2xl h-40 w-40 shadow-xl flex flex-col items-center justify-center text-2xl font-bold cursor-auto transition-all duration-300 ${
                  !timer
                    ? "bg-base-100 border-2 border-dotted border-gray-800 hover:scale-105"
                    : "bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white hover:shadow-2xl hover:scale-105"
                }`}
              >
                <IndTimer timer={timer} onAddTimer={() => setShowModal(true)} />
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default MainTimer;
