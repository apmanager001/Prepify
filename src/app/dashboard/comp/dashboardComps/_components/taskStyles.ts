import {
  Calendar,
  NotebookPen,
  LucideIcon,
  Clock,
  CheckCircle2,
} from "lucide-react";

export type TaskType =
  | "planner"
  | "timer"
  | "notes"
  | "all";

export type TaskProgress = {
  current: number;
  target: number;
  label: string;
  note?: string;
};

export type DailyTask = {
  id: string;
  type: TaskType;
  label: string;
  completed: boolean;
  coins: number;
  progress: TaskProgress;
};

export type DailyTasks = DailyTask[];

export type TaskStyle = {
  icon: LucideIcon;
  bg: string;
  color: string;
  href: string | null;
};

export const TASK_STYLES: Record<string, TaskStyle> = {
  planner: {
    icon: Calendar,
    bg: "bg-orange-500/15",
    color: "text-orange-500",
    href: "/dashboard?tab=planner",
  },

  timer: {
    icon: Clock,
    bg: "bg-green-500/15",
    color: "text-green-500",
    href: "/dashboard?tab=lab",
  },
  notes: {
    icon: NotebookPen,
    bg: "bg-green-500/15",
    color: "text-green-500",
    href: "/dashboard?tab=lab",
  },
  all: {
    icon: CheckCircle2,
    bg: "bg-emerald-500/15",
    color: "text-emerald-500",
    href: null,
  },
};
