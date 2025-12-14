"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import IndTimer from "./indTimer";
import AddTimerModal from "./addTimer";
import { useTimerStore } from "@/store/useTimerStore";
import LoadingComp from "@/lib/loading";

// Maximum number of timers allowed
const MAX_TIMERS = 5;

const MainTimer = () => {
  // List of all timers from global store
  const timers = useTimerStore((state) => state.timers);
  // Controls visibility of add modal
  const [showModal, setShowModal] = useState(false);
  // True when Zustand has finished rehydrating state
  const loading = useTimerStore((state) => state.hasHydrated);
  // Stores the timer index currently being edited (null = new timer)
  const [editingIndex, setEditingIndex] = useState(null);
  // Only show up to MAX_TIMERS timers in case a user somehow has more than 5
  const displayedTimers = timers.slice(0, MAX_TIMERS);

  const handleAddNew = () => {
    setEditingIndex(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingIndex(null);
    setShowModal(false);
  };

  // Show loading screen until hydration completes
  if (!loading) {
    return <LoadingComp />;
  }

  return (
    <div className="flex flex-col mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 w-full">
        <div className="flex gap-2 items-center">
          <h3 className="text-xl font-bold">Focus Timer</h3>
          <p>
            ({timers.length}/{MAX_TIMERS})
          </p>
        </div>
        <button
          className="btn btn-sm text-base-content hover:bg-base-300 rounded-lg mx-2"
          onClick={handleAddNew}
          disabled={timers.length >= MAX_TIMERS}
        >
          <Plus /> New
        </button>
      </div>

      {/* Add Timer Modal */}
      <AddTimerModal
        isOpen={showModal}
        onClose={handleCloseModal}
        timerIndex={editingIndex}
      />

      {/* Timer Cards */}
      <div className="flex justify-center items-center gap-12 flex-wrap">
        {timers.length > 0 &&
          displayedTimers.map((timer, index) => (
            <div
              key={timer.id ?? index}
              className="relative rounded-2xl h-40 w-40 shadow-xl flex flex-col items-center justify-center text-2xl font-bold cursor-auto transition-all duration-300 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white hover:shadow-2xl hover:scale-105"
            >
              <IndTimer
                index={index}
                onEdit={() => {
                  setEditingIndex(index);
                  setShowModal(true);
                }}
              />
            </div>
          ))}

        {/* Add Timer Card */}
        {timers.length < MAX_TIMERS && (
          <div
            className="relative rounded-2xl h-40 w-40 shadow-xl flex flex-col items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 bg-base-200 border-2 border-dotted border-base-border hover:scale-105 hover:shadow-lg hover:bg-base-300"
            onClick={handleAddNew}
          >
            <div className="text-2xl font-semibold mb-2">Add Timer</div>
            <Plus size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainTimer;
