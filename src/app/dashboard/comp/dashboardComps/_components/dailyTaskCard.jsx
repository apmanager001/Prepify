"use client";

import { useState } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  PartyPopper,
  Gift,
} from "lucide-react";
import { TASK_STYLES } from "./taskStyles";
import { useRouter } from "next/navigation";

export default function DailyTasksCard({ dailyTasks }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const visibleTasks = expanded
    ? dailyTasks
    : dailyTasks.filter((t) => !t.completed);

  const completedCount = dailyTasks.filter((t) => t.completed).length;
  const totalCount = dailyTasks.length;

  const noneComplete = completedCount === 0
  const allComplete = completedCount === totalCount;

  const handleTaskClick = (task) => {
    const style = TASK_STYLES[task.type];
    if (style?.href) router.push(style.href);
  };

  return (
    <div className="h-full p-4 flex flex-col gap-4 bg-base-100 rounded-lg shadow-sm w-full border border-base-content/20 duration-200 hover:shadow-md transition-shadow">

      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b border-base-content/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Star className="text-warning fill-warning" size={20} />
          </div>

          <div className="flex flex-col">
            <h2 className="font-semibold text-sm">Daily Tasks</h2>
            <span className="text-xs text-gray-400">
              {completedCount}/{totalCount} completed
            </span>
          </div>
        </div>

        {!allComplete && !noneComplete && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition"
          >
            {expanded ? (
              <>
                Hide Completed <ChevronUp size={16} />
              </>
            ) : (
              <>
                View All <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {/* TASK LIST */}
      <div className="h-76 overflow-y-auto flex flex-col gap-2 p-2 border-b border-base-content/20 no-scrollbar">
        {allComplete && !expanded ? (
          <div className="flex items-center gap-2 text-success bg-success/10 rounded-lg p-4">
            <PartyPopper size={18} />
            <span className="text-sm font-medium">
              Congratulations! All daily tasks are completed.
            </span>
          </div>
        ) : (
          visibleTasks.map((task) => {
            const style = TASK_STYLES[task.type];
            const Icon = style.icon;

            const progress = task.progress;

            return (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={`flex flex-col rounded-lg px-3 py-2 gap-2 ${style.bg} ${
                  style.href
                    ? "cursor-pointer hover:opacity-80 transition hover:scale-[1.02]"
                    : ""
                }`}
              >
                {/* TOP ROW */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                      <Icon size={18} className={style.color} />
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        {task.label}
                      </span>

                      {/* PROGRESS TEXT */}
                      {progress && (
                        <span className="text-xs text-base-content/60">
                          {progress.current}/{progress.target} —{" "}
                          {progress.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* COINS */}
                  <div className="text-xs font-semibold px-2 py-1 rounded">
                    +{task.coins}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-auto flex items-center gap-2 rounded-lg p-3 bg-base-200">
        <Gift size={18} className="text-warning" />
        <p className="text-xs">
          Points keep you motivated and unlock premium rewards!
        </p>
      </div>
    </div>
  );
}
