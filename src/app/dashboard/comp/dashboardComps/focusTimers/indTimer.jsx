"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, Trash2, RotateCcw } from "lucide-react";
import { useTimerStore } from "@/store/useTimerStore";

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
      <div className="absolute top-2 left-2 text-primary">
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
      </div>

      {/* Delete */}
      <div className="absolute top-2 right-2 text-error">
        <Trash2
          className="cursor-pointer"
          onClick={() => setShowDeletePopup(true)}
        />
      </div>

      {/* Timer Name */}
      <div className="text-sm font-semibold mt-4 text-center">{timer.name}</div>

      {/* Remaining time */}
      <div className="mt-2 text-center text-white">
        <div className="text-xs">Study</div>
        <div className="text-2xl font-bold">{formatTime(displaySeconds)}</div>
      </div>

      {/* Play/Pause */}
      <div className="mt-4 flex justify-center">
        <button className="btn btn-sm btn-primary btn-outline btn-circle rounded-lg">
          {timer.isRunning ? (
            <Pause onClick={() => pauseTimer(index)} />
          ) : (
            <Play onClick={() => startTimer(index)} />
          )}
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeletePopup &&
        modalRootRef.current &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-4">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <p>Are you sure?</p>

              <div className="flex justify-end space-x-4">
                <button
                  className="btn bg-base-200 rounded-lg hover:bg-base-300"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn bg-base-200 text-error rounded-lg hover:bg-base-300"
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

export default IndTimer;
