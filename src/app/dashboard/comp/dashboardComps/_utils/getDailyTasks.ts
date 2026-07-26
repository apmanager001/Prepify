import { DailyTasks } from "../_components/taskStyles";
import { dailyTasks } from "./dailyTasks";
import { Coin } from "./getTodaysCoins";

export function getDailyTasks(events: Coin[] | null): DailyTasks {
  const completedTaskIds = new Set(events?.map((event) => event.task) || []);
  return dailyTasks.map(task => ({
    ...task,
    completed: completedTaskIds.has(task.id),
  }));
}