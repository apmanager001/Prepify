"use client";

import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp, PartyPopper, Gift } from "lucide-react";
import { TASK_STYLES } from "./taskStyles";

export default function DailyTasksCard({
  dailyTasks,
  completedCount,
  totalCount,
}) {
  const [expanded, setExpanded] = useState(false);

  const incompleteTasks = dailyTasks.filter((t) => !t.completed);
  const allComplete = incompleteTasks.length === 0;

  return (
    <div className="h-full p-4 flex flex-col gap-4 bg-base-100 rounded-lg shadow-sm w-full border border-base-content/20  duration-200 hover:shadow-md transition-shadow">
      {" "}
      {/* ROW 1 */}
      <div className="flex items-center justify-between p-3 border-b border-base-content/20">
        <div className="flex items-center gap-3">
          {/* Star Icon */}
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Star className="text-warning fill-warning" size={20} />
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <h2 className="font-semibold text-sm">Daily Tasks</h2>

            <span className="text-xs text-gray-400">
              {completedCount}/{totalCount} completed
            </span>
          </div>
        </div>

        {/* View All Button */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition hover:cursor-pointer"
        >
          View All
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {/* ROW 2 */}
      <div className="h-76 overflow-y-auto flex flex-col gap-2 pr-1 border-b border-base-content/20 pb-2">
        {" "}
        {allComplete && !expanded ? (
          <div className="flex items-center gap-2 text-success bg-success/10 rounded-lg p-4">
            <PartyPopper size={18} />

            <span className="text-sm font-medium">
              Congratulations! All daily tasks are completed.
            </span>
          </div>
        ) : (
          <>
            {(expanded
              ? dailyTasks
              : dailyTasks.filter((t) => !t.completed)
            ).map((task) => {
              const style = TASK_STYLES[task.type];
              const Icon = style.icon;

              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between rounded-lg px-2 py-2 ${style.bg}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center`}
                    >
                      <Icon size={18} className={style.color} />
                    </div>

                    <span
                      className={`text-sm ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.label}
                    </span>
                  </div>

                  <span
                    className={
                      task.completed ? "text-success" : "text-base-content/40"
                    }
                  >
                    {task.completed ? "✔" : "○"}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
      {/* ROW 3 */}
      <div className="mt-auto flex items-center gap-2 rounded-lg p-3 bg-base-200 ">
        <Gift size={18} className="text-warning" />

        <p className="text-xs">
          Points keep you motivated and unlock premium rewards!
        </p>
      </div>
    </div>
  );
}
