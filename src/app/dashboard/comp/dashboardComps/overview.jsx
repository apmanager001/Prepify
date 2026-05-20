import { Flame, Trophy } from "lucide-react";
import { useCalendarEvents } from "../calendar/lib/calendar";
import { useNotes } from "../notes/lib/notesApi";
import { useTodos } from "../todo/lib/todoAPI";
import { Star } from "lucide-react";
import useTotalScore, { useDailyScore } from "./useTotalScore";
import QuickStartTimer from "./focusTimers/quickStartTimer";
import DailyTasksCard from "./_components/dailyTaskCard";
import QuickLinks from "./_components/quickLinks";
import DashboardThirdRow from "./_components/dashboardThirdRow";
import StatsBadge from "./statsBadge";

function percentOfAllTime(allTimeCoins, todayCoins) {
  const total = Number(allTimeCoins);
  const today = Number(todayCoins);

  if (!Number.isFinite(total) || !Number.isFinite(today)) return 0;

  if (total === 0) return today === 0 ? 0 : 100;

  return Number(((today / total) * 100).toFixed(2));
}

const Overview = () => {
  const {
    data: dailyData,
    isLoading: dailyLoading,
    isError: dailyError,
  } = useDailyScore();

  // Daily coins
  const DAILY_COINS_NUM = (() => {
    const raw = dailyData;

    const maybeNumber =
      raw && typeof raw === "object"
        ? (raw.total ?? raw.totalScore ?? raw.score ?? null)
        : typeof raw === "number"
          ? raw
          : null;

    return Number.isFinite(maybeNumber) ? maybeNumber : 0;
  })();

  const {
    data: totalScoreData,
    isLoading: totalScoreLoading,
    isError: totalScoreError,
  } = useTotalScore();

  // Lifetime coins
  const lifetimeCoins = (() => {
    const raw = totalScoreData;

    const total =
      raw && typeof raw === "object"
        ? (raw.totalScore ?? raw.total ?? raw.score ?? null)
        : typeof raw === "number"
          ? raw
          : null;

    return total ?? 0;
  })();

  const stats = [
    {
      id: "dailyCoins",
      icon: (
        <div className="bg-[#eeb54a] text-white rounded-lg p-2">
          <Star className="w-5 h-5" />
        </div>
      ),
      label: "Today's Coins",
      value: dailyLoading ? "…" : dailyError ? "—" : String(DAILY_COINS_NUM),
      subValue: `${percentOfAllTime(
        lifetimeCoins,
        DAILY_COINS_NUM,
      )}% increase from yesterday`,
      positive: true,
    },

    {
      id: "totalCoins",
      icon: (
        <div className="bg-[#282828] text-[#e3ceae] rounded-lg p-2">
          <Trophy className="w-5 h-5" />
        </div>
      ),
      label: "Total Coins",
      value: totalScoreLoading
        ? "…"
        : totalScoreError
          ? "—"
          : String(lifetimeCoins),
      subValue: "Lifetime earned coins",
      positive: true,
    },

    {
      id: "streak",
      icon: (
        <div className="bg-[#f0ac5c] text-white rounded-lg p-2">
          <Flame className="w-5 h-5" />
        </div>
      ),
      label: "Current Streak",
      value: "14",
      subValue: "Personal best",
      positive: true,
    },
  ];

  const { data: notesData } = useNotes({
    // return server shape directly; assume server returns an array
    select: (v) => (Array.isArray(v) ? v : (v.notes ?? [])),
  });

  const { data: todosData } = useTodos();

  const TODO_COUNT = Array.isArray(todosData) ? todosData.length : 0;
  const NOTES_COUNT = Array.isArray(notesData) ? notesData.length : 0;

  // note: keep icon background classes inline per-card for easier per-card tweaks
  // Compute current month's ISO date-only range (YYYY-MM-DD)
  const startOfMonthIso = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
    .toISOString()
    .split("T")[0];
  const endOfMonthIso = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  )
    .toISOString()
    .split("T")[0];

  const { data: monthData, isLoading: monthLoading } = useCalendarEvents({
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

  const dailyTasks = [
    {
      id: "login",
      type: "login",
      label: "Daily Login",
      completed: true,
    },
    {
      id: "calendar",
      type: "event",
      label: "Add or Finish Calendar Event",
      completed: THIS_MONTH_EVENTS > 0,
    },
    {
      id: "study",
      type: "timer",
      label: "Study for 25 minutes",
      completed: false,
    },
    {
      id: "music",
      type: "music",
      label: "Listen to music for 5 minutes",
      completed: false,
    },
    {
      id: "notes",
      type: "notes",
      label: "Write a note",
      completed: NOTES_COUNT > 0,
    },
    {
      id: "todo",
      type: "todo",
      label: "Complete a task",
      completed: TODO_COUNT > 0,
    },
  ];

  const completedCount = dailyTasks.filter((t) => t.completed).length;
  const totalCount = dailyTasks.length;

  return (
    <div className="flex flex-col gap-4 mb-24 xl:mb-10">
      {/* Header */}
      <header className="headerContainer">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-content uppercase tracking-wide">
            DashBoard
          </h1>
          <div className="text-sm text-neutral-content/80">
            Your progress, rewards, and stats at a glance
          </div>
        </div>
      </header>
      {/* Stat Cards */}
      <StatsBadge stats={stats} />
      {/* Focus Timer, Dailies, and Quicklinks */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 items-stretch">
        <div className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
          <QuickStartTimer />
        </div>

        <div className="h-full">
          <DailyTasksCard
            dailyTasks={dailyTasks}
            completedCount={completedCount}
            totalCount={totalCount}
          />
        </div>
        <QuickLinks />
      </div>
      <DashboardThirdRow />
    </div>
  );
};

export default Overview;
