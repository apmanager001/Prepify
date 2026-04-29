import React from "react";

export default function DailiesModal({
  setIsModalOpen,
  DAILY_COINS_NUM,
  DAILY_GOAL_DASH,
  dailyTasks,
  completedCount,
  totalCount,
  allComplete,
}) {
  const TaskRow = ({ label, completed }) => {
    return (
      <div className="flex items-center justify-between w-full px-4 py-3 border-b">
        <span className="text-sm">{label}</span>
        <span
          className={`text-lg" ${completed ? "text-success" : "text-gray-400"}`}
        >
          {completed ? "✔" : "○"}
        </span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setIsModalOpen(false)}
    >
      <div className="bg-base-100 text-black rounded-lg p-8 w-96 relative">
        {/* Close button (top right) */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 left-2 text-lg font-bold hover:cursor-pointer"
        >
          x
        </button>
        <h2 className="text-lg font-semibold mb-2 text-center">Daily Tasks</h2>
        <p className="text-sm text-center">
          You have <b>{DAILY_COINS_NUM}</b> out of{" "}
          <b>{DAILY_GOAL_DASH} daily coins</b>
        </p>
        <div className="flex flex-col w-full">
          {dailyTasks.map((task) => (
            <TaskRow
              key={task.id}
              label={task.label}
              completed={task.completed}
            />
          ))}
        </div>
        <div className="flex flex-col w-full px-4 py-3 mt-4 bg-base-200 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm">
              Bonus: Complete all daily tasks
            </span>

            <span className="text-sm">
              {allComplete ? "✔" : `${completedCount}/${totalCount}`}
            </span>
          </div>

          <div className="w-full bg-gray-200 h-2 mt-2 rounded">
            <div
              className="bg-primary h-2 rounded"
              style={{
                width: `${(completedCount / totalCount) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
