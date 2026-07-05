import { getUtcDayKey } from "./getUtcDayKey";

export type Coin = {
  type: string;
  task?: string;
  taskDate?: string;
  notes?: string;
  coins: number;
  amount?: number;
  createdAt: string;
};

export type CoinsResponse = {
  coins: Coin[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export function groupCoinsByDay(coins: Coin[]) {
  return coins.reduce<Record<string, Coin[]>>((groups, coin) => {
    if (!coin.taskDate) return groups;

    const day = new Date(coin.taskDate).toISOString().slice(0, 10);

    if (!groups[day]) {
      groups[day] = [];
    }

    groups[day].push(coin);

    return groups;
  }, {});
}

export function getTodaysCoins(coins: Coin[]) {
  const todayKey = getUtcDayKey();

  return coins.filter((coin) => {
    if (!coin.taskDate) return false;

    const coinDay = new Date(coin.taskDate).toISOString().slice(0, 10);

    return coinDay === todayKey;
  });
}

export function getTodaysCoinTotal(coins: Coin[]) {
  return getTodaysCoins(coins).reduce(
    (sum, coin) => sum + (coin.coins || 0),
    0,
  );
}
