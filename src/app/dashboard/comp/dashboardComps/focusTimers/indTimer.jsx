"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTimer } from "./timerApi";
import toast from "react-hot-toast";

const IndTimer = ({ timer, onAddTimer }) => {
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    typeof timer?.timeSet === "number" ? timer.timeSet * 60 : 0
  );
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const intervalRef = React.useRef(null);

  const queryClient = useQueryClient();

  // Use a direct async call instead of `useMutation` to avoid potential
  // React Query runtime/version issues in the environment (Turbopack/Next).
  // This keeps behavior simple: call the API, show toast, and invalidate cache.
  const handleDelete = async () => {
    console.log("Deleting timer with id:", timer?._id);
    if (!timer?._id) {
      toast.error("Invalid timer id");
      return;
    }

    try {
      await deleteTimer(timer._id);
      toast.success("Timer deleted successfully!");
      setShowDeletePopup(false);
      queryClient.invalidateQueries(["timer"]);
    } catch (err) {
      console.error("Failed to delete timer", err);
      toast.error("Failed to delete timer. Please try again.");
    }
  };

  // Simple Portal modal to ensure overlay renders at document.body and
  // covers the full viewport even when this component is nested inside
  // other positioned/overflow containers.
  const Modal = ({ children }) => {
    const elRef = React.useRef(null);
    if (!elRef.current && typeof document !== "undefined") {
      elRef.current = document.createElement("div");
    }

    React.useEffect(() => {
      const el = elRef.current;
      if (!el) return;
      document.body.appendChild(el);
      return () => {
        document.body.removeChild(el);
      };
    }, []);

    if (!elRef.current) return null;
    return createPortal(children, elRef.current);
  };

  React.useEffect(() => {
    if (isActive && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, secondsLeft]);

  React.useEffect(() => {
    // Reset timer if timer.timeSet changes
    setSecondsLeft(typeof timer?.timeSet === "number" ? timer.timeSet * 60 : 0);
  }, [timer?.timeSet]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (!timer) {
    return (
      <>
        <div className="text-center text-gray-400 cursor-default">
          <div className="text-2xl font-semibold ">Add Timer</div>
          <button
            className="btn btn-sm btn-circle rounded-lg"
            onClick={onAddTimer}
          >
            <Plus />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-sm font-semibold cursor-default">
        {timer.name || "Unnamed"}
      </div>
      <div className="text-3xl font-bold tracking-wide cursor-default">
        {formatTime(secondsLeft)}
      </div>
      <div className="absolute top-2 right-2 text-error">
        <Trash2
          className="cursor-pointer"
          onClick={() => setShowDeletePopup(true)}
        />
      </div>
      <div>
        <button className="btn btn-sm btn-primary btn-outline btn-circle rounded-lg">
          {isActive ? (
            <Pause
              onClick={() => setIsActive(false)}
              className="cursor-pointer"
            />
          ) : (
            <Play
              onClick={() => setIsActive(true)}
              className="cursor-pointer"
            />
          )}
        </button>
      </div>

      {showDeletePopup && (
        <Modal>
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 w-full h-full z-50 ">
            <div className="bg-base-200 p-6 rounded-lg shadow-lg space-y-4 border-1 border-black/70">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <p>Are you sure you want to delete this timer?</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="btn btn-secondary btn-soft"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-error" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default IndTimer;
