"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  BookOpen,
  PocketKnife as Tool,
  CheckSquare,
  Calendar,
  Settings,
  Play,
  Pause,
  Undo,
  Redo,
} from "lucide-react";
import CurrentPlayer from "./currentPlayer";
import Img from "next/image";
import MainTimer from "./focusTimers/mainTimer";
import useToolStore from "@/lib/toolStore";
import { useTimerStore } from "@/store/useTimerStore";

const ToolCard = ({ Icon, title, subtitle }) => (
  <button className="w-full text-left bg-white p-3 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center">
        <Icon size={18} className="text-gray-700" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
    </div>
  </button>
);

const CompactPlayer = () => {
  const playlist = useToolStore((s) => s.playlist);
  const currentIndex = useToolStore((s) => s.currentIndex);
  const isPlaying = useToolStore((s) => s.isPlaying);
  const next = useToolStore((s) => s.next);
  const prev = useToolStore((s) => s.prev);
  const toggle = useToolStore((s) => s.toggle);

  const current = playlist?.[currentIndex] || playlist?.[0] || {};

  return (
    <div className="flex items-center gap-3">
      <Img
        src={current?.image || "/albumnArt/interstellar.webp"}
        alt={current?.title || "cover"}
        width={40}
        height={40}
        className="h-12 w-12 rounded-md object-cover"
      />
      <div className="hidden sm:flex sm:items-center sm:gap-2">
        <div className="text-sm font-medium text-gray-800 truncate max-w-[12rem]">
          {current?.title}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={prev}
          className="btn btn-xs border-none rounded "
          aria-label="Previous"
        >
          <Undo size={14} />
        </button>
        <button
          onClick={toggle}
          className="btn btn-xs border-none rounded-full"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={next}
          className="btn btn-xs border-none rounded"
          aria-label="Next"
        >
          <Redo size={14} />
        </button>
      </div>
    </div>
  );
};

const TimerMini = () => {
  const timers = useTimerStore((s) => s.timers);
  const startTimer = useTimerStore((s) => s.startTimer);
  const stopTimer = useTimerStore((s) => s.stopTimer);
  const resetTimer = useTimerStore((s) => s.resetTimer);

  const displayed = (timers || []).slice(0, 5);

  const fmt = (sec) => {
    if (sec == null) return "0:00";
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = String(s % 60).padStart(2, "0");
    return `${m}:${rem}`;
  };

  return (
    <div className="flex items-center gap-2 max-w-96 flex-wrap">
      {displayed.length === 0 ? (
        <div className="text-xs text-gray-500">No timers</div>
      ) : (
        displayed.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-info/10 px-2 py-1 rounded-md border border-gray-100 shadow-sm w-28"
          >
            <div className="text-xs font-medium text-gray-700 truncate max-w-12">
              {t.name || `Timer ${i + 1}`}
            </div>
            <div className="text-xs text-gray-500">
              {fmt(t.remainingSeconds)}
            </div>
            <div className="flex items-center gap-1">
              {t.isRunning ? (
                <button
                  onClick={() => stopTimer(i)}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Stop timer"
                >
                  <Pause size={14} />
                </button>
              ) : (
                <button
                  onClick={() => startTimer(i)}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Start timer"
                >
                  <Play size={14} />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
const ToolsFooter = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      {/* Header row - collapsed content + toggle */}
      <div className="flex items-center justify-between px-4  gap-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full">
          {/* Quick icons - always visible */}
          <div className="flex-1 items-center gap-2 bg-gray-50 px-2 py-1 rounded-md">
            <CompactPlayer />
          </div>
          <div className="flex-2 items-center gap-2 bg-gray-50 px-2 py-1 rounded-md w-full justify-center">
            <TimerMini />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <button
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="btn rounded-lg border border-gray-200 -mt-8 z-20"
              aria-label={open ? "Collapse tools" : "Expand tools"}
            >
              {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
            <div className="font-bold text-gray-500 mt-1">Tools</div>
          </div>
        </div>
      </div>

      {/* Expanded panel */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[520px] py-4" : "max-h-0"
        }`}
      >
        <div className="px-3 pb-4">
          <div className="max-h-[440px] overflow-y-auto pr-2">
            {/* Expanded content: larger widgets */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
              <div className="bg-white rounded-md p-3 border border-gray-100 shadow-sm">
                <CurrentPlayer />
              </div>
              <div className="bg-white rounded-md p-3 border border-gray-100 shadow-sm">
                <MainTimer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsFooter;
