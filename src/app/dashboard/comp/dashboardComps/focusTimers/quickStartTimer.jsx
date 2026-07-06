"use client";
import React, { useEffect, useMemo, useState } from "react";
import { History, Timer } from "lucide-react";

const STUDY_PRESETS = [
  { label: "Pomodoro 25:00", minutes: 25 },
  { label: "Deep Focus 45:00", minutes: 45 },
  { label: "Quick Sprint 15:00", minutes: 15 },
  { label: "Long Session 60:00", minutes: 60 },
];

const formatTime = (seconds) => {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const QuickStartTimer = () => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const tickCount = 60;
  const tickStep = 360 / tickCount;
  const ringRadius = 39;
  const ringStrokeWidth = 4;
  const tickInnerY = 50 - ringRadius - ringStrokeWidth / 2 - 0.6;

  useEffect(() => {
    if (isRunning || isPaused) return;
    setRemainingSeconds(selectedMinutes * 60);
  }, [selectedMinutes, isRunning, isPaused]);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const id = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsPaused(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, isPaused]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(false);
      return;
    }

    setIsPaused(false);
    setIsRunning(true);
  };

  const handlePauseResume = () => {
    if (!isRunning) return;
    setIsPaused((prev) => !prev);
  };

  const totalSeconds = selectedMinutes * 60;
  const progressRatio = useMemo(() => {
    if (!totalSeconds) return 0;
    return remainingSeconds / totalSeconds;
  }, [remainingSeconds, totalSeconds]);

  const activeTickCount = useMemo(() => {
    if (!remainingSeconds) return 0;
    return Math.max(1, Math.ceil(progressRatio * tickCount));
  }, [progressRatio, remainingSeconds, tickCount]);

  const elapsedTickCount = tickCount - activeTickCount;

  const tickMarks = useMemo(
    () =>
      Array.from({ length: tickCount }, (_, index) => ({
        index,
        rotation: 0 + index * tickStep,
        length:
          index % 15 === 0
            ? 8
            : index % 5 === 0
              ? 6.4
              : index % 2 === 0
                ? 5
                : 3.8,
        isActive: index >= elapsedTickCount,
      })),
    [elapsedTickCount, tickCount, tickStep],
  );

  const tickMarksColor = "hsl(26 89.6% 71.5%)";
  const timerScaleVars = {
    "--timer-size": "14rem",
    "--timer-inner-inset": "1rem",
    "--timer-time-size": "3rem",
    "--timer-select-max-width": "13rem",
    "--timer-content-padding-x": "1rem",
    "--timer-vertical-padding": "1rem",
    "--timer-gap": "1.5rem",
    "--timer-button-min-width": "10rem",
    "--timer-button-height": "3rem",
    "--timer-button-font-size": "1rem",
    "--timer-title-font-size": "0.875rem",
    "--timer-title-gap": "0.5rem",
    "--timer-title-padding-x": "0.5rem",
    "--timer-title-padding-y": "0.5rem",
    "--timer-title-icon-size": "1.125rem",
    "--timer-title-icon-padding": "0.5rem",
    "--timer-history-font-size": "0.875rem",
    "--timer-history-icon-size": "1rem",
  };

  return (
    <div
      className="bg-base-100 rounded-lg shadow-sm w-full border border-base-content/20 p-2 h-full [--timer-scale:0.74] xl:[--timer-scale:1] hover:shadow-md transition-shadow flex flex-col"
      style={timerScaleVars}
    >
      <div className="flex items-center justify-between border-b border-base-content/20 pb-3">
        <div
          className="bg-base-100 rounded-lg text-neutral font-medium flex items-center"
          style={{
            fontSize:
              "calc(var(--timer-title-font-size) * max(var(--timer-scale), 0.9))",
            gap: "calc(var(--timer-title-gap) * var(--timer-scale))",
            paddingInline:
              "calc(var(--timer-title-padding-x) * var(--timer-scale))",
            paddingBlock:
              "calc(var(--timer-title-padding-y) * var(--timer-scale))",
          }}
        >
          <div
            className="flex items-center text-neutral-content border-3 border-primary bg-neutral rounded-xl hover:scale-105"
            style={{
              fontSize:
                "calc(var(--timer-title-icon-size) * max(var(--timer-scale), 0.9))",
              padding:
                "calc(var(--timer-title-icon-padding) * var(--timer-scale))",
            }}
          >
            <Timer />
          </div>
          <div className="flex flex-col">
            <div className="text-base font-semibold text-neutral-900">
              Focus Timer
            </div>

            <div className="text-sm text-neutral-500">
              Stay focused and earn coins
            </div>
          </div>{" "}
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm normal-case text-base-content/70"
          style={{
            fontSize:
              "calc(var(--timer-history-font-size) * max(var(--timer-scale), 0.9))",
          }}
        >
          <History
            style={{
              height:
                "calc(var(--timer-history-icon-size) * max(var(--timer-scale), 0.9))",
              width:
                "calc(var(--timer-history-icon-size) * max(var(--timer-scale), 0.9))",
            }}
          />
          <span>History</span>
        </button>
      </div>

      <div
        className="flex flex-col items-center"
        style={{
          gap: "calc(var(--timer-gap) * var(--timer-scale))",
          paddingBlock:
            "calc(var(--timer-vertical-padding) * var(--timer-scale))",
        }}
      >
        <div
          className="relative overflow-hidden rounded-full shadow-inner"
          style={{
            backgroundColor: "var(--color-base-200)",
            height: "calc(var(--timer-size) * var(--timer-scale))",
            width: "calc(var(--timer-size) * var(--timer-scale))",
          }}
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            style={{ color: tickMarksColor }}
          >
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              style={{
                stroke: "var(--color-base-content)",
                strokeOpacity: 0.12,
              }}
              strokeWidth={ringStrokeWidth}
            />
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              pathLength="100"
              style={{ stroke: "currentColor", strokeOpacity: 0.22 }}
              strokeDasharray={`${progressRatio * 100} 100`}
              strokeLinecap="round"
              strokeWidth={ringStrokeWidth}
              transform="rotate(-90 50 50)"
            />

            {tickMarks.map((tick) => (
              <line
                key={`guide-${tick.index}`}
                x1="50"
                x2="50"
                y1={tickInnerY - Math.max(2.6, tick.length - 1.4)}
                y2={tickInnerY}
                style={{
                  stroke: "var(--color-base-content)",
                  strokeOpacity: 0.3,
                }}
                strokeLinecap="round"
                strokeWidth={tick.length >= 6 ? 1.2 : 0.95}
                transform={`rotate(${tick.rotation} 50 50)`}
              />
            ))}

            {tickMarks.map((tick) =>
              tick.isActive ? (
                <line
                  key={`active-${tick.index}`}
                  x1="50"
                  x2="50"
                  y1={tickInnerY - tick.length}
                  y2={tickInnerY}
                  style={{
                    stroke: "currentColor",
                    strokeOpacity: 1,
                    filter:
                      "drop-shadow(0 0 2.5px color-mix(in oklab, currentColor 45%, transparent))",
                  }}
                  strokeLinecap="round"
                  strokeWidth={tick.length >= 6 ? 1.9 : 1.55}
                  transform={`rotate(${tick.rotation} 50 50)`}
                />
              ) : null,
            )}
          </svg>

          <div
            className="absolute rounded-full border border-base-content/10 bg-base-100 flex flex-col items-center justify-center text-center"
            style={{
              inset: "calc(var(--timer-inner-inset) * var(--timer-scale))",
              paddingInline:
                "calc(var(--timer-content-padding-x) * var(--timer-scale))",
            }}
          >
            <div
              className="font-bold tabular-nums tracking-tight leading-none"
              style={{
                fontSize: "calc(var(--timer-time-size) * var(--timer-scale))",
              }}
            >
              {formatTime(remainingSeconds)}
            </div>

            <select
              className="select select-sm w-full"
              value={selectedMinutes}
              onChange={(e) => setSelectedMinutes(Number(e.target.value))}
              disabled={isRunning}
              style={{
                fontSize: "calc(0.875rem * max(var(--timer-scale), 0.85))",
                marginTop: "calc(0.75rem * var(--timer-scale))",
                maxWidth:
                  "calc(var(--timer-select-max-width) * var(--timer-scale))",
              }}
            >
              {STUDY_PRESETS.map((preset) => (
                <option key={preset.label} value={preset.minutes}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`btn ${isRunning ? "btn-neutral" : "btn-primary"}`}
            onClick={handleStartStop}
            style={{
              fontSize:
                "calc(var(--timer-button-font-size) * max(var(--timer-scale), 0.88))",
              height: "calc(var(--timer-button-height) * var(--timer-scale))",
              minHeight:
                "calc(var(--timer-button-height) * var(--timer-scale))",
              minWidth:
                "calc(var(--timer-button-min-width) * var(--timer-scale))",
              paddingInline: "calc(1rem * var(--timer-scale))",
            }}
          >
            {isRunning ? "Stop Focus" : "Start Focus"}
          </button>
          {isRunning && (
            <button
              type="button"
              className="btn"
              onClick={handlePauseResume}
              style={{
                fontSize:
                  "calc(var(--timer-button-font-size) * max(var(--timer-scale), 0.88))",
                height: "calc(var(--timer-button-height) * var(--timer-scale))",
                minHeight:
                  "calc(var(--timer-button-height) * var(--timer-scale))",
                minWidth:
                  "calc(var(--timer-button-min-width) * var(--timer-scale))",
                paddingInline: "calc(1rem * var(--timer-scale))",
              }}
            >
              {isPaused ? "Resume Focus" : "Pause Focus"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickStartTimer;
