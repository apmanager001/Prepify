import { ArrowRight, Zap, Check, ClipboardList } from "lucide-react";

import { TASK_STYLES } from "./taskStyles";
import { useState } from "react";

const initialTodayPlan = [
  {
    id: 1,
    type: "event",
    title: "Math Final Review",
    subject: "math",
    class: "Calculus II",
    time: "8:00 AM",
    status: "Pending",
  },

  {
    id: 2,
    type: "music",
    title: "Practice Piano",
    subject: "music",
    class: "Music Theory",
    time: "11:30 AM",
    status: "Pending",
  },

  {
    id: 3,
    type: "todo",
    title: "Complete Homework",
    subject: "science",
    class: "Physics",
    time: "3:15 PM",
    status: "Completed",
  },
];

const activityData = [
  {
    id: 1,
    type: "notes",
    title: "Notes Uploaded",
    time: "2 mins ago",
    points: "+25 Coins",
  },
  {
    id: 2,
    type: "timer",
    title: "Study Session Completed",
    time: "18 mins ago",
    points: "+40 Coins",
  },
  {
    id: 3,
    type: "event",
    title: "Event Joined",
    time: "1 hour ago",
    points: "+10 Coins",
  },
];

const SUBJECT_STYLES = {
  math: {
    bg: "bg-blue-500/15",
    color: "text-blue-500",
    border: "border-blue-500",
  },

  science: {
    bg: "bg-green-500/15",
    color: "text-green-500",
    border: "border-green-500",
  },

  history: {
    bg: "bg-orange-500/15",
    color: "text-orange-500",
    border: "border-orange-500",
  },

  english: {
    bg: "bg-purple-500/15",
    color: "text-purple-500",
    border: "border-purple-500",
  },

  music: {
    bg: "bg-pink-500/15",
    color: "text-pink-500",
    border: "border-pink-500",
  },

  programming: {
    bg: "bg-cyan-500/15",
    color: "text-cyan-500",
    border: "border-cyan-500",
  },

  art: {
    bg: "bg-red-500/15",
    color: "text-red-500",
    border: "border-red-500",
  },

  business: {
    bg: "bg-yellow-500/15",
    color: "text-yellow-500",
    border: "border-yellow-500",
  },
};
export default function DashboardThirdRow() {
  const [tasks, setTasks] = useState(initialTodayPlan);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* LEFT LARGE PANEL */}
      <div className="lg:col-span-2 rounded-3xl border border-base-content/20 p-2 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-warning">
            <ClipboardList className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              TODAY&apos;S PLAN
            </h2>
          </div>
        </div>

        {/* Task List */}
        <div className="my-2 space-y-2">
          {tasks.map((task) => {
            const subjectStyle = SUBJECT_STYLES[task.subject];

            return (
              <div
                key={task.id}
                className="flex items-center gap-2 rounded-2xl border border-base-content/20 px-2 py-2 transition-all hover:bg-base-200"
              >
                {/* Check Button */}
                <button
                  onClick={() =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === task.id
                          ? {
                              ...t,
                              status:
                                t.status === "Completed"
                                  ? "Pending"
                                  : "Completed",
                            }
                          : t,
                      ),
                    )
                  }
                  className={`
  flex h-8 w-8 shrink-0 items-center justify-center
  rounded-full border transition-all duration-200 cursor-pointer
  ${
    task.status === "Completed"
      ? `${subjectStyle.bg} ${subjectStyle.color.replace("text-", "border-")}`
      : `${subjectStyle.border}`
  }
`}
                >
                  {task.status === "Completed" ? (
                    <Check size={20} className={subjectStyle.color} />
                  ) : (
                    <></>
                  )}
                </button>

                {/* Title + Class */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-base-content">
                    {task.title}
                  </p>

                  <p className="truncate text-sm text-base-content/60">
                    {task.class}
                  </p>
                </div>

                {/* Time */}
                <div className="hidden text-sm font-medium text-base-content/70 sm:block">
                  {task.time}
                </div>

                {/* Status */}
                <div
                  className={`rounded-full px-3 py-1 text-xs font-medium text-base-content/70 ${subjectStyle.bg}`}
                >
                  {task.status}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Button */}
        <div className="flex items-center justify-center">
          <button className="group flex items-center gap-2 rounded-xl border border-base-content/20 px-5 py-3 text-sm font-medium text-neutral-800 transition-all hover:bg-base-200 cursor-pointer">
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* RIGHT SMALL PANEL */}
      <div className="rounded-3xl border border-base-content/20 p-5 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <Zap className="h-5 w-5 text-warning" />
            </div>

            <h2 className="text-lg font-semibold tracking-tight">
              Recent Activity
            </h2>
          </div>

          <button className="group flex items-center gap-2 rounded-xl border border-base-content/20 px-5 py-3 text-sm font-medium text-neutral-800 transition-all hover:bg-base-200 cursor-pointer">
            View All
          </button>
        </div>

        {/* Activity List */}
        <div className="mt-5 space-y-4">
          {activityData.map((activity) => {
            const style = TASK_STYLES[activity.type];

            const Icon = style.icon;

            return (
              <div key={activity.id} className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.bg}`}
                >
                  <Icon className={`h-5 w-5 ${style.color}`} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {activity.title}
                  </p>

                  <p className="text-xs text-base-2000">{activity.time}</p>
                </div>

                {/* Points */}
                <div className={`text-sm font-semibold ${style.color}`}>
                  {activity.points}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
