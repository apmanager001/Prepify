"use client";
import React, { useState } from "react";
import { Play, Pause, Plus } from "lucide-react";

const IndTimer = ({ timer, onAddTimer }) => {
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    typeof timer?.timeSet === "number" ? timer.timeSet * 60 : 0
  );
  const intervalRef = React.useRef(null);

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
    </>
  );
};

export default IndTimer;
