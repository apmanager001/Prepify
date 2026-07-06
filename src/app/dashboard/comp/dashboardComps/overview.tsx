import { Flame, Coins } from "lucide-react";
import QuickStartTimer from "./focusTimers/quickStartTimer";
import DailyTasksCard from "./_components/dailyTaskCard";
import QuickLinks from "./_components/quickLinks";
import DashboardThirdRow from "./_components/dashboardThirdRow";
import StatsBadge, { StatsBadgeItem } from "./statsBadge";
import { useCoinDetails, useTotalCoins } from "./useTotalCoin";
import {
  getTodaysCoins,
  getTodaysCoinTotal,
} from "./_utils/getTodaysCoins";
import { DailyTasks } from "./_components/taskStyles";

const Overview = ({ isAdmin }: { isAdmin: boolean }) => {
  const {
    data: totalCoinData,
    isLoading: totalCoinLoading,
    isError: totalCoinError,
  } = useTotalCoins();

  const {
    data: coinsData,
    isLoading: coinsDataLoading,
    isError: coinsDataError,
  } = useCoinDetails();

  // Daily coins
  const DAILY_COINS_NUM = (() => {
    if (!coinsData) {
      return null;
    }
    const raw = getTodaysCoinTotal(getTodaysCoins(coinsData.coins));

    return Number(raw);
  })();

  // Lifetime coins
  const lifetimeCoins = (() => {
    if (!totalCoinData) {
      return "";
    }
    const raw = totalCoinData.total;

    const total =
      raw && typeof raw === "object"
        ? (raw.totalScore ?? raw.total ?? raw.score ?? null)
        : typeof raw === "number"
          ? raw
          : null;

    return total ?? 0;
  })();

  const stats: StatsBadgeItem[] = [
    {
      id: "coins",
      icon: <Coins />,
      label: "Coins",
      value: totalCoinLoading
        ? "…"
        : totalCoinError
          ? "—"
          : lifetimeCoins.toLocaleString(),

      subValue: coinsDataLoading
        ? "Loading today's coins..."
        : coinsDataError
          ? "No Coins Earned Yet."
          : DAILY_COINS_NUM === null
            ? "No Coins Earnedd Yet."
            : DAILY_COINS_NUM > 0
              ? `+${DAILY_COINS_NUM.toLocaleString()} today`
              : "",

      trend: coinsDataLoading
        ? "neutral"
        : coinsDataError
          ? "neutral"
          : DAILY_COINS_NUM === null
            ? "neutral"
            : DAILY_COINS_NUM > 0
              ? `positive`
              : "negative",
    },
    {
      id: "streak",
      icon: <Flame />,
      label: "Current Streak",
      value: "14",
      subValue: "Personal best",
      trend: "positive",
      iconContainerClassName: "bg-[#f0ac5c] border-black",
      iconClassName: "text-white",
    },
  ];

  const dailyTasks: DailyTasks = [
    {
      id: "plan-day",
      type: "planner",
      label: "Plan Your Day",
      completed: false,
      coins: 5,
      progress: {
        current: 0,
        target: 3,
        label: "3 priority tasks added",
      },
    },
    {
      id: "pomodoro",
      type: "timer",
      label: "Complete One Pomodoro",
      completed: false,
      coins: 30,
      progress: {
        current: 0,
        target: 1,
        label: "1 Pomodoro completed",
        note: "+5 bonus on first completion",
      },
    },
    {
      id: "review-note",
      type: "notes",
      label: "Review One Old Note",
      completed: false,
      coins: 10,
      progress: {
        current: 0,
        target: 1,
        label: "1 old note reviewed (5+ words recall)",
      },
    },
    {
      id: "double-down",
      type: "timer",
      label: "Double Down",
      completed: false,
      coins: 15,
      progress: {
        current: 0,
        target: 2,
        label: "2 Pomodoros today",
        note: "Only rewards on second completion",
      },
    },
    {
      id: "deadline",
      type: "planner",
      label: "Set a Deadline",
      completed: false,
      coins: 5,
      progress: {
        current: 0,
        target: 1,
        label: "1 task with due date set",
      },
    },
    {
      id: "clear-board",
      type: "all",
      label: "Clear the Board",
      completed: false,
      coins: 10,
      progress: {
        current: 0,
        target: 1,
        label: "All priority tasks completed today",
      },
    },
  ];

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
          />
        </div>
        <QuickLinks isAdmin={isAdmin}/>
      </div>
      <DashboardThirdRow activityData={coinsData?.coins ?? []} coinsDataLoading={coinsDataLoading} coinsDataError={coinsDataError} />
    </div>
  );
};

export default Overview;
