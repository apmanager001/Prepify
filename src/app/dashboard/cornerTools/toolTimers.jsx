import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, Trash2, RotateCcw, Plus } from "lucide-react";
import { useTimerStore } from "@/store/useTimerStore";
import AddTimerModal from "../comp/dashboardComps/focusTimers/addTimer";
import LoadingComp from "@/lib/loading";

const MAX_TIMERS = 5;
const timerWidth = 40;
const timerHeight = 32;

const ToolTimers = () => {
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
    <div className="flex justify-center items-center gap-4 flex-wrap w-84">
      <AddTimerModal
        isOpen={showModal}
        onClose={handleCloseModal}
        timerIndex={editingIndex}
      />
      {timers.length > 0 &&
        displayedTimers.map((timer, index) => (
          <div
            key={timer.id ?? index}
            className={`relative rounded-2xl h-${timerHeight} w-${timerWidth} shadow-xl flex flex-col items-center justify-center text-2xl font-bold cursor-auto transition-all duration-300 bg-linear-to-br from-gray-800 via-gray-900 to-black text-white hover:shadow-2xl hover:scale-105`}
          >
            <IndTimer index={index} onEdit={() => {}} />
          </div>
        ))}

      {/* Add Timer Card */}
      {timers.length < MAX_TIMERS && (
        <div
          className={`relative rounded-2xl h-${timerHeight} w-${timerWidth} shadow-xl flex flex-col items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 bg-gray-200 border-2 border-dotted border-gray-400 hover:scale-105 hover:shadow-lg`}
          onClick={handleAddNew}
        >
          <div className="text-gray-600 text-2xl font-semibold mb-2">
            Add Timer
          </div>
          <Plus className="text-gray-600" size={24} />
        </div>
      )}
    </div>
  );
};

export default ToolTimers;

const IndTimer = ({ index, onEdit }) => {
  // Read this timer from Zustand using its index
  const timer = useTimerStore((s) => s.timers[index]);

  // Store actions (index-based)
  const deleteTimer = useTimerStore((s) => s.removeTimer);
  const startTimer = useTimerStore((s) => s.startTimer);
  const pauseTimer = useTimerStore((s) => s.stopTimer);
  const resetTimer = useTimerStore((s) => s.resetTimer);

  // Live remaining seconds value from store
  const remainingSeconds = timer?.remainingSeconds ?? 0;
  // UI-only rounded display value
  const displaySeconds = Math.floor(remainingSeconds);

  // Reference to the portal root element
  const modalRootRef = useRef(null);

  // Create portal container div once on the client
  if (typeof document !== "undefined" && !modalRootRef.current) {
    modalRootRef.current = document.createElement("div");
  }

  // Attach portal root to body when mounted
  useEffect(() => {
    if (!modalRootRef.current) return;
    document.body.appendChild(modalRootRef.current);
    return () => document.body.removeChild(modalRootRef.current);
  }, []);

  // Format seconds → mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  return (
    <>
      {/* Reset */}
      <div className="absolute bottom-2 text-primary flex justify-around items-center w-full">
        <button
          className={`${
            timer.startedAt ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          }`}
          onClick={() => {
            if (!timer.startedAt) return;
            resetTimer(index);
          }}
        >
          <RotateCcw size={20} />
        </button>
        <button className="btn btn-sm btn-primary btn-outline btn-circle rounded-lg ">
          {timer.isRunning ? (
            <Pause onClick={() => pauseTimer(index)} />
          ) : (
            <Play onClick={() => startTimer(index)} />
          )}
        </button>
        <Trash2
          className="cursor-pointer"
          onClick={() => setShowDeletePopup(true)}
        />
      </div>

      {/* Timer Name */}
      <div className=" absolute top-2 text-xs font-semibold text-center px-2">
        {timer.name}
      </div>

      {/* Remaining time */}
      <div className=" absolute top-10 text-center text-white">
        <div className="text-xs">Study</div>
        <div className="text-xl font-bold">{formatTime(displaySeconds)}</div>
      </div>

      {showDeletePopup &&
        modalRootRef.current &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-base-200 p-6 rounded-lg shadow-lg space-y-4">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <p>Are you sure?</p>

              <div className="flex justify-end space-x-4">
                <button
                  className="btn btn-secondary rounded-lg"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-error rounded-lg"
                  onClick={() => {
                    deleteTimer(index);
                    setShowDeletePopup(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          modalRootRef.current
        )}
    </>
  );
};
