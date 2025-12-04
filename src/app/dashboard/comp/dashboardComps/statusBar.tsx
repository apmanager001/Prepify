// components/ArchedStatusBar.tsx
"use client";
import React from "react";
import useTotalScore from "./useTotalScore";

// Placeholder daily goal and points. Backend API will replace this.
const DAILY_GOAL = 50;
const DAILY_POINTS_PLACEHOLDER = 23;

export default function StatusBar() {
  const { data, isLoading, isError } = useTotalScore();

  // compute percent for radial progress
  const percent = Math.min(
    100,
    Math.round((DAILY_POINTS_PLACEHOLDER / Math.max(1, DAILY_GOAL)) * 100)
  );

  // pick a color class for progress: red if low, amber if mid, green if high
  let progressColor = "text-error";
  if (percent >= 80) progressColor = "text-success";
  else if (percent >= 50) progressColor = "text-amber-500";

  const lifetimeDisplay = (() => {
    const raw = data;
    const total =
      raw && typeof raw === "object"
        ? raw.totalScore ?? raw.total ?? raw.score ?? null
        : typeof raw === "number"
        ? raw
        : null;
    return total ?? null;
  })();

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 h-full">
      {/* lifetime score (styled) */}
      <div className="text-center">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading score…</div>
        ) : isError ? (
          <div className="text-sm text-red-500">Score unavailable</div>
        ) : (
          <>
            <div className="text-xs text-gray-500">Lifetime Score</div>
            <div className="text-2xl font-extrabold text-indigo-700">
              {lifetimeDisplay ?? "—"} pts
            </div>
          </>
        )}
      </div>

      {/* radial progress for daily points only (styled & color-coded) */}
      <div className="flex flex-col items-center justify-center">
        <div
          className={`radial-progress ${progressColor} bg-indigo-50 font-extrabold text-3xl shadow-lg`}
          style={
            {
              "--value": percent,
              "--size": "9rem",
              "--thickness": "1.25rem",
            } as React.CSSProperties
          }
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {DAILY_POINTS_PLACEHOLDER}
        </div>

        <div className="mt-2 text-center">
          <div className="text-sm font-semibold text-gray-700">
            Daily Points
          </div>
          <div className="text-xs text-gray-500">
            {DAILY_POINTS_PLACEHOLDER} / {DAILY_GOAL} pts
          </div>
          <div className="text-xs text-gray-400">
            (placeholder — will fetch from API)
          </div>
        </div>
      </div>
    </div>
  );
}
