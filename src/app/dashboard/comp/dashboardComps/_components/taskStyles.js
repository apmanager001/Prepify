import {
  LogIn,
  Calendar,
  BookOpen,
  Music,
  NotebookPen,
  CheckSquare,
} from "lucide-react";

export const TASK_STYLES = {
  login: {
    icon: LogIn,
    bg: "bg-blue-500/15",
    color: "text-blue-500",
  },

  event: {
    icon: Calendar,
    bg: "bg-orange-500/15",
    color: "text-orange-500",
  },

  timer: {
    icon: BookOpen,
    bg: "bg-purple-500/15",
    color: "text-purple-500",
  },

  music: {
    icon: Music,
    bg: "bg-pink-500/15",
    color: "text-pink-500",
  },

  notes: {
    icon: NotebookPen,
    bg: "bg-green-500/15",
    color: "text-green-500",
  },

  todo: {
    icon: CheckSquare,
    bg: "bg-yellow-500/15",
    color: "text-yellow-500",
  },
};
