import {
  Calendar,
  Flame,
  NotebookPen,
  SquareCheckBig,
  Target,
  Trophy,
} from "lucide-react";
import { Roboto } from "next/font/google";
import { useCalendarEvents } from "../calendar/lib/calendar";
import { useNotes } from "../notes/lib/notesApi";
import { useTodos } from "../todo/lib/todoAPI";
import { Star } from "lucide-react";
import useTotalScore, { useDailyScore } from "./useTotalScore";
import QuickStartTimer from "./focusTimers/quickStartTimer";
import StatBadge from "./_components/statBadge";
import DailyTasksCard from "./_components/dailyTaskCard";
import QuickLinks from "./_components/quickLinks";
import DashboardThirdRow from "./_components/dashboardThirdRow";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const today = new Date().toISOString().split("T")[0];

function percentOfAllTime(allTimeCoins, todayCoins) {
  const total = Number(allTimeCoins);
  const today = Number(todayCoins);

  if (!Number.isFinite(total) || !Number.isFinite(today)) return 0;

  if (total === 0) return today === 0 ? 0 : 100;

  return Number(((today / total) * 100).toFixed(2));
}

const Overview = ({ changePage }) => {
  const fullCardClass =
    "customContainer overflow-hidden min-h-64 h-full flex flex-col";
  const cardHeaderClass =
    "bg-neutral-content text-neutral px-4 py-2 text-sm font-medium";
  const cardItemClass =
    "cursor-pointer p-2 bg-neutral-content text-primary border-2 border-neutral-content/60 rounded-md flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-3";
  const iconClass =
    "flex items-center text-neutral-content text-lg border-3 border-primary bg-neutral p-2 rounded-xl hover:scale-105";

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

  const statCards = [
    {
      id: "dailyCoins",
      icon: Star,
      iconBg: "bg-[#eeb54a]",
      iconColor: "text-white",

      title: "Today's Coins",
      amount: dailyLoading ? "…" : dailyError ? "—" : String(DAILY_COINS_NUM),
      stat: `${percentOfAllTime(lifetimeCoins, DAILY_COINS_NUM)}% increase from yesterday`,
      statClassName: "text-success",
    },
    {
      id: "totalCoins",
      icon: Trophy,
      iconBg: "bg-[#282828]",
      iconColor: "text-[#e3ceae]",
      title: "Total Coins",
      amount: totalScoreLoading
        ? "…"
        : totalScoreError
          ? "—"
          : String(lifetimeCoins),
      stat: "Lifetime earned coins",
    },
    {
      id: "streak",
      icon: Flame,
      iconBg: "bg-[#f0ac5c]",
      iconColor: "text-white",
      title: "Current Streak",
      amount: "14",
      stat: "Personal best",
    },
  ];

  const {
    data: notesData,
    isLoading,
    isError,
  } = useNotes({
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <StatBadge
              key={card.id}
              icon={
                <Icon className={`h-6 w-6 ${card.iconColor || "text-white"}`} />
              }
              iconBg={card.iconBg}
              title={card.title}
              amount={card.amount}
              stat={card.stat}
              statClassName={card.statClassName}
            />
          );
        })}
      </div>
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
      {/* Calendar, Notes, and Todos */}
      {/* <div
        className={`grid grid-cols-1 md:grid-cols-2 w-full gap-4 ${roboto.className}`}
      >
        <div className="w-full">
          <div className={fullCardClass}>
            <div className={`${cardHeaderClass} flex items-center gap-2`}>
              <div className={`${iconClass}`}>
                <Calendar />
              </div>
              {`Today's Calendar Events ${todaysDate}`}
            </div>
            <div className="p-4 flex-1 min-h-32">
              {calendarLoading ? (
                <div className="text-sm text-neutral-content w-full">
                  <LoadingComp />
                </div>
              ) : !fetchEventData ||
                !Array.isArray(fetchEventData?.events) ||
                fetchEventData.events.length === 0 ? (
                <div className="text-sm text-neutral-content">
                  No events for today
                </div>
              ) : (
                <div className="space-y-3">
                  {fetchEventData?.events.map((ev) => (
                    <div
                      onClick={() => changePage("calendar")}
                      key={ev._id}
                      className={`${cardItemClass}`}
                    >
                      <div className="flex items-stretch justify-between w-full">
                        <div>
                          <div className="text-sm font-semibold text-neutral">
                            {ev.eventTitle}
                          </div>
                          {ev.eventDescription && (
                            <div className="text-xs text-neutral-content ml-2">
                              {ev.eventDescription}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-neutral-content/80">
                          {ev.eventTime ||
                            new Date(ev.eventDate).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className={fullCardClass}>
            <div className={`${cardHeaderClass} flex items-center gap-2`}>
              <div className={`${iconClass}`}>
                <NotebookPen />
              </div>
              Notes
            </div>
            <div className="p-4 flex-1 min-h-32">
              {notesLoading ? (
                <div className="text-sm text-neutral-content w-full">
                  <LoadingComp />
                </div>
              ) : !notesList || notesList.length === 0 ? (
                <div className="text-sm text-neutral-content">No notes</div>
              ) : (
                <div className="space-y-3">
                  {notesList.slice(0, 6).map((n, i) => (
                    <div
                      onClick={() => changePage("notes")}
                      key={n._id || i}
                      className={cardItemClass}
                    >
                      <div className="flex items-stretch justify-between w-full gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-neutral truncate">
                            {n.title || n.noteTitle}
                          </div>
                          {n.body && (
                            <div
                              className="text-xs text-neutral overflow-hidden"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {n.body}
                            </div>
                          )}
                        </div>

                        {n.createdAt && (
                          <div className="text-xs text-neutral/80 ml-4 whitespace-nowrap">
                            {new Date(n.createdAt).toLocaleDateString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mb-14">
          <div className={fullCardClass}>
            <div className={`${cardHeaderClass} flex items-center gap-2`}>
              <div className={`${iconClass}`}>
                <SquareCheckBig />
              </div>
              To Do
            </div>
            <div className="p-4 flex-1 min-h-32">
              {todosLoading ? (
                <div className="text-sm text-neutral-content w-full">
                  <LoadingComp />
                </div>
              ) : !todosList || todosList.length === 0 ? (
                <div className="text-sm text-neutral-content">No tasks</div>
              ) : (
                <div className="space-y-3">
                  {todosList.slice(0, 6).map((t, i) => (
                    <div
                      onClick={() => changePage("todo")}
                      key={t._id || t.id || i}
                      className={`${cardItemClass}`}
                    >
                      <div className="flex items-stretch gap-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-success mt-1 sm:mt-0 cursor-default"
                          checked={!!t.completed}
                          readOnly
                          aria-label={`Todo ${
                            t.title || t.task || t.text
                          } completed`}
                        />
                        <div className="text-sm text-neutral">
                          {t.title || t.task || t.text}
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0 flex items-center gap-3">
                        {t.createdAt && (
                          <div className="text-xs text-neutral/80">
                            {new Date(t.createdAt).toLocaleDateString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Overview;
