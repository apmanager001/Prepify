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
import { useMemo } from "react";

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

  // Daily Events
  const DAILY_EVENTS = useMemo(() => {
    if (!coinsData) {
      return null;
    }
    const raw = getTodaysCoins(coinsData.coins);
    return Array.isArray(raw) ? raw : null;
  }, [coinsData]);

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
          <DailyTasksCard DAILY_EVENTS={DAILY_EVENTS} />
        </div>
        <QuickLinks isAdmin={isAdmin}/>
      </div>
      <DashboardThirdRow activityData={coinsData?.coins ?? []} coinsDataLoading={coinsDataLoading} coinsDataError={coinsDataError} />
    </div>
  );
};

export default Overview;
