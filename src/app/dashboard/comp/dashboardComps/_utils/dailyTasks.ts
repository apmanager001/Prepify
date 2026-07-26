import { DailyTasks } from "../_components/taskStyles";

export const dailyTasks: DailyTasks = [
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
