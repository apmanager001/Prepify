// components/ArchedStatusBar.tsx
"use client";
import React, { useState } from "react";
import useTotalScore from "./useTotalScore";

export default function StatusBar() {
  const [value, setValue] = useState(0);
  const [statusBar, setStatusBar] = useState(true);
  const { data, isLoading, isError } = useTotalScore();

  const handleChange = (delta: number) => {
    setValue((prev) => Math.min(100, Math.max(0, prev + delta)));
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 h-full mx-10">
      <button
        className="btn btn-primary absolute top-10 center rounded-2xl"
        onClick={() => setStatusBar(!statusBar)}
      >
        Toggle Status Bar
      </button>
      {/* total score display */}
      <div className="text-sm text-gray-700">
        {isLoading ? (
          <span>Loading score…</span>
        ) : isError ? (
          <span>Score unavailable</span>
        ) : (
          (() => {
            const raw = data;
            const total =
              raw && typeof raw === "object"
                ? raw.totalScore ?? raw.total ?? raw.score ?? null
                : typeof raw === "number"
                ? raw
                : null;
            return (
              <span className="font-medium">
                Lifetime Score: {total ?? "—"} pts
              </span>
            );
          })()
        )}
      </div>
      <div className="relative w-full h-40 overflow-hidden flex items-center justify-center">
        {statusBar ? (
          <>
            <progress
              className="progress progress-success bg-error w-full"
              value={value}
              max="100"
            ></progress>
            <div className="absolute inset-0 flex items-end justify-center pb-2 text-lg font-extrabold">
              {value}%
            </div>
          </>
        ) : (
          <div
            className="radial-progress text-success bg-primary/30 font-extrabold text-2xl"
            style={
              {
                "--value": value,
                "--size": "10rem",
                "--thickness": "1.5rem",
              } as React.CSSProperties
            }
            aria-valuenow={value}
            role="progressbar"
          >
            {value}%
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button className="btn btn-error" onClick={() => handleChange(-10)}>
          Decrease
        </button>
        <button className="btn btn-success" onClick={() => handleChange(10)}>
          Increase
        </button>
      </div>
    </div>
  );
}
