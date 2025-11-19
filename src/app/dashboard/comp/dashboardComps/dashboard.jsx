"use client";
import React from "react";
import { Zap, CheckSquare, FileText, Award } from "lucide-react";
import { Calendar } from "lucide-react";
import useTotalScore, { useDailyScore } from "./useTotalScore";
import { useCalendarEvents } from "../calendar/lib/calendar";
import { useNotes } from "../notes/lib/notesApi";

// import StatusBar from "./statusBar";
import CurrentPlayer from "./currentPlayer";
import MainTimer from "./focusTimers/mainTimer";

const DashboardPage = () => {
  // Placeholder stats — replace with real data via hooks
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
  const TODO_COUNT = 5;
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

  // Shared style constants for header stat cards — change here to affect all cards
  const STAT_CARD_BASE =
    "flex items-center gap-3 px-3 py-2 rounded-md border border-gray-200";
  const STAT_ICON_WRAP =
    "w-9 h-9 rounded-full hidden md:flex items-center justify-center";
  const STAT_TEXT_WRAP = "flex flex-col items-center flex-2";
  const STAT_LABEL = "text-xs text-gray-500 truncate";
  const STAT_VALUE = "text-sm font-semibold truncate";
  const STAT_MIN_W = "min-w-[140px]";
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
  const DAILY_GOAL_DASH = 100;
  const dashPercent = Math.min(
    100,
    Math.round((DAILY_POINTS_NUM / Math.max(1, DAILY_GOAL_DASH)) * 100)
  );

  let dashColor = "text-error";
  if (dashPercent >= 80) dashColor = "text-success";
  else if (dashPercent >= 50) dashColor = "text-amber-500";

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white rounded-md shadow-sm">
        <div className="flex-1 flex items-center justify-between md:justify-start gap-4 w-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
              Dashboard
            </h1>
            <div className="text-sm text-gray-500">
              Overview & quick actions
            </div>
          </div>
          <div className="flex items-center gap-3 min-w-[150px]">
            <div
              className={`radial-progress ${dashColor} bg-indigo-50 font-extrabold text-xl`}
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

            <div className="flex flex-col text-left">
              <div className="text-xs text-gray-500">Daily points</div>
              <div className="text-sm font-semibold text-indigo-700">
                {dailyLoading ? "…" : dailyError ? "—" : DAILY_POINTS_NUM || 0}{" "}
                pts
              </div>
            </div>
          </div>
        </div>

        <div className="flex-2 mt-3 md:mt-0 flex flex-wrap items-center justify-center gap-3">
          {/* generic stat card */}
          <div className={`${STAT_CARD_BASE} ${STAT_MIN_W} bg-indigo-50/40`}>
            <div className={`${STAT_ICON_WRAP} bg-indigo-50`}>
              <Zap className="text-indigo-600" size={18} />
            </div>
            <div className={STAT_TEXT_WRAP}>
              <div className={STAT_LABEL}>Daily Points</div>
              <div className={`${STAT_VALUE} text-indigo-700`}>
                {DAILY_POINTS_NUM}
              </div>
            </div>
          </div>

          <div className={`${STAT_CARD_BASE} ${STAT_MIN_W} bg-green-50/40`}>
            <div className={`${STAT_ICON_WRAP} bg-green-50`}>
              <CheckSquare className="text-green-600" size={18} />
            </div>
            <div className={STAT_TEXT_WRAP}>
              <div className={STAT_LABEL}>To Do</div>
              <div className={STAT_VALUE}>{TODO_COUNT}</div>
            </div>
          </div>

          <div className={`${STAT_CARD_BASE} ${STAT_MIN_W} bg-blue-50/40`}>
            <div className={`${STAT_ICON_WRAP} bg-blue-50`}>
              <FileText className="text-blue-600" size={18} />
            </div>
            <div className={STAT_TEXT_WRAP}>
              <div className={STAT_LABEL}>Notes</div>
              <div className={STAT_VALUE}>{NOTES_COUNT}</div>
            </div>
          </div>
          <div className={`${STAT_CARD_BASE} ${STAT_MIN_W} bg-sky-50/40`}>
            <div className={`${STAT_ICON_WRAP} bg-sky-50`}>
              <Calendar className="text-sky-600" size={18} />
            </div>
            <div className={STAT_TEXT_WRAP}>
              <div className={STAT_LABEL}>This Month</div>
              <div className={STAT_VALUE}>
                {monthLoading
                  ? "…"
                  : monthError
                  ? "—"
                  : `${THIS_MONTH_EVENTS} events`}
              </div>
            </div>
          </div>
          <div className={`${STAT_CARD_BASE} ${STAT_MIN_W} bg-yellow-50/40`}>
            <div className={`${STAT_ICON_WRAP} bg-yellow-50`}>
              <Award className="text-yellow-600" size={18} />
            </div>
            <div className={STAT_TEXT_WRAP}>
              <div className={STAT_LABEL}>Lifetime Points</div>
              <div className={STAT_VALUE}>
                {totalLoading ? "…" : totalError ? "—" : lifetimePoints ?? "—"}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-col md:flex-row gap-4 md:gap-4">
        <div className="flex-1 ">
          {/* <StatusBar /> */}
          <CurrentPlayer />
        </div>
        <div className="flex-2">
          <MainTimer />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
