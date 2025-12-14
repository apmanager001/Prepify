"use client";
import React from "react";
import { Zap, CheckSquare, FileText, Award } from "lucide-react";
import { Calendar } from "lucide-react";
import useTotalScore, { useDailyScore } from "../useTotalScore";
import { useCalendarEvents } from "../../calendar/lib/calendar";
import { useNotes } from "../../notes/lib/notesApi";
import { useTodos } from "../../todo/lib/todoAPI";

const Stats = () => {
  const {
    data: dailyData,
    isLoading: dailyLoading,
    isError: dailyError,
  } = useDailyScore();
  const {
    data: notesData,
    isLoading,
    isError,
  } = useNotes({
    // return server shape directly; assume server returns an array
    select: (v) => (Array.isArray(v) ? v : v.notes ?? []),
  });

  const {
    data: todosData,
    isLoading: todosLoading,
    isError: todosError,
  } = useTodos();

  // derive a numeric daily points value from the possible response shapes
  const DAILY_POINTS_NUM = (() => {
    const raw = dailyData;
    const maybeNumber =
      raw && typeof raw === "object"
        ? raw.total ?? raw.totalScore ?? raw.score ?? null
        : typeof raw === "number"
        ? raw
        : null;
    return Number.isFinite(maybeNumber) ? maybeNumber : 0;
  })();
  const TODO_COUNT = Array.isArray(todosData) ? todosData.length : 0;
  const NOTES_COUNT = Array.isArray(notesData) ? notesData.length : 0;
  const {
    data: totalData,
    isLoading: totalLoading,
    isError: totalError,
  } = useTotalScore();

  const lifetimePoints = (() => {
    const raw = totalData;
    const total =
      raw && typeof raw === "object"
        ? raw.totalScore ?? raw.total ?? raw.score ?? null
        : typeof raw === "number"
        ? raw
        : null;
    return total ?? null;
  })();

  // note: keep icon background classes inline per-card for easier per-card tweaks
  // Compute current month's ISO date-only range (YYYY-MM-DD)
  const startOfMonthIso = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];
  const endOfMonthIso = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  )
    .toISOString()
    .split("T")[0];

  const {
    data: monthData,
    isLoading: monthLoading,
    isError: monthError,
  } = useCalendarEvents({
    from: startOfMonthIso,
    to: endOfMonthIso,
    page: 1,
    pageSize: 200,
  });

  const THIS_MONTH_EVENTS = (() => {
    const d = monthData;
    if (!d) return monthLoading ? "…" : 0;
    // backend returns { events, page, pageSize, totalCount, totalPages }
    if (Array.isArray(d)) return d.length;
    if (Array.isArray(d.events)) return d.events.length;
    if (typeof d.totalCount === "number") return d.totalCount;
    // try common aliases
    if (Array.isArray(d.data)) return d.data.length;
    if (Array.isArray(d.items)) return d.items.length;
    return 0;
  })();
  // small radial shown next to header (quick glance) — uses same scale as StatusBar
  const DAILY_GOAL_DASH = 250;
  const dashPercent = Math.min(
    100,
    Math.round((DAILY_POINTS_NUM / Math.max(1, DAILY_GOAL_DASH)) * 100)
  );

  let dashColor = "text-error";
  if (dashPercent >= 80) dashColor = "text-success";
  else if (dashPercent >= 50) dashColor = "text-amber-500";

  const statsList = [
    // {
    //   key: "daily",
    //   label: "Daily Points",
    //   value: () => (dailyLoading ? "…" : dailyError ? "—" : DAILY_POINTS_NUM),
    //   suffix: "pts",
    //   icon: Zap,
    //   iconBg: "bg-indigo-50",
    //   cardBg: "bg-indigo-50/40",
    //   iconClass: "text-indigo-600",
    //   valueClass: "text-indigo-700",
    // },
    {
      key: "todo",
      label: "To Do",
      value: () => TODO_COUNT,
      icon: CheckSquare,
      iconBg: "bg-success/10",
      cardBg: "bg-success/10",
      iconClass: "text-success",
      valueClass: "",
    },
    {
      key: "notes",
      label: "Notes",
      value: () => NOTES_COUNT,
      icon: FileText,
      iconBg: "bg-info/10",
      cardBg: "bg-info/20",
      iconClass: "text-info",
      valueClass: "",
    },
    {
      key: "lifetime",
      label: "Lifetime Points",
      value: () =>
        totalLoading ? "…" : totalError ? "—" : lifetimePoints ?? "—",
      icon: Award,
      iconBg: "bg-warning/10",
      cardBg: "bg-warning/10",
      iconClass: "text-warning",
      valueClass: "",
    },
    {
      key: "month",
      label: "This Month",
      value: () =>
        monthLoading ? "…" : monthError ? "—" : `${THIS_MONTH_EVENTS} events`,
      icon: Calendar,
      iconBg: "bg-info/10",
      cardBg: "bg-info/10",
      iconClass: "text-info",
      valueClass: "",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 px-4 md:px-0">
      <div className="flex flex-col justify-center items-center gap-3 row-span-2 h-full">
        <div
          className={`radial-progress ${dashColor} bg-info/30 font-extrabold text-lg`}
          style={{
            "--value": String(dashPercent),
            "--size": "4.5rem",
            "--thickness": "0.9rem",
          }}
          role="img"
          aria-label={`Daily points ${DAILY_POINTS_NUM} of ${DAILY_GOAL_DASH}`}
        >
          {dailyLoading ? "…" : dailyError ? "—" : DAILY_POINTS_NUM}
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="text-sm font-bold text-neutral-content uppercase text-wrap">
            Daily Points
          </div>
        </div>
      </div>
      {statsList.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.key}
            className={`${s.cardBg} flex items-center gap-3 p-1 rounded-md shadow-sm border border-white/10 text-white/80`}
          >
            <div
              className={`${s.iconBg} w-9 h-9 rounded-full flex items-center justify-center`}
            >
              <Icon className={s.iconClass} size={18} />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="text-xs truncate">{s.label}</div>
              <div className={`text-sm font-semibold truncate ${s.valueClass}`}>
                {s.value()}{" "}
                {s.suffix ? <span className="text-xs">{s.suffix}</span> : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
