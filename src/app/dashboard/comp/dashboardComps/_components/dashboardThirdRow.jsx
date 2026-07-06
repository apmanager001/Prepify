import { ArrowRight, Zap, Check, ClipboardList } from "lucide-react";

import { TASK_STYLES } from "./taskStyles";
import { useMemo, useState } from "react";
import { Coin } from "../_utils/getTodaysCoins";
import { PLANNER_TYPE_LABELS, PlannerEvent } from "./plannerStyles";
import { useCalendarEvents, useUpdateCalendarEvent } from "../../calendar/lib/calendar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formatTimeValue = (value) => {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return "Any time";

  const [hours, minutes] = value.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatTimeRange = (
  startTime,
  endTime,
) => {
  if (startTime && endTime) {
    return `${formatTimeValue(startTime)} - ${formatTimeValue(endTime)}`;
  }

  if (startTime) {
    return formatTimeValue(startTime);
  }

  return "Any time";
};

const toDateKey = (value) => {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getStartOfWeek = (value) => {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  const weekday = date.getDay();
  const delta = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + delta);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getWeekDays = (value) => {
  const start = getStartOfWeek(value);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

// type Props = {
//   activityData: Coin[];
//   coinsDataLoading: Boolean;
//   coinsDataError: Boolean;
// };

export default function DashboardThirdRow({ activityData, coinsDataLoading, coinsDataError }) {
  const router = useRouter();

  // Task List
  const todayIndex = (new Date().getDay() + 6) % 7;
  const weekAnchor = getStartOfWeek(new Date())

  const weekDays = useMemo(() => getWeekDays(weekAnchor), [weekAnchor]);
  const from = toDateKey(weekDays[todayIndex]);
  const to = toDateKey(weekDays[todayIndex]);

  const { data, isLoading, isError } = useCalendarEvents({
    from,
    to,
    page: 1,
    pageSize: 200,
  });
  const updateEventMutation = useUpdateCalendarEvent();

  //PlannerEvent type
  const handleToggleEventComplete = async (event) => {
    const nextCompleted = !event.completed;

    try {
      await updateEventMutation.mutateAsync({
        id: event._id,
        eventPayload: {
          completed: nextCompleted,
        },
      });

      toast.success(
        nextCompleted ? "Task Completed" : "Task marked as incomplete",
      );
    } catch (error) {
      console.error("Failed to update event completion", error);
      toast.error("Failed to update planner item");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* LEFT LARGE PANEL */}
      <div className="lg:col-span-2 rounded-3xl border border-base-content/20 p-2 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-warning">
            <ClipboardList className="h-6 w-6" />
          </div>

          <h2 className="text-lg font-semibold tracking-tight">
            TODAY&apos;S PLAN
          </h2>
        </div>

        {/* Task List */}
        <div className="my-2 space-y-2">
          {/* Task List */}
          <div className="my-2 space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-sm text-base-content/60">
                Loading today`&apos;s plan...
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-10 text-sm text-error">
                Failed to load today`&apos;s plan.
              </div>
            ) : (data?.events?.length ?? 0) === 0 ? (
              <div className="flex items-center justify-center py-10 text-center text-sm text-base-content/60">
                Nothing planned for today. Enjoy the extra time or add something to your
                planner.
              </div>
                ) : (
              // PlannerEvent type  and ! check for data
              data.events.map((event) => (
                <div
                  key={event._id}
                  className="flex items-center gap-2 rounded-2xl border border-base-content/20 px-2 py-2 transition-all hover:bg-base-200"
                >
                  {/* Complete Button */}
                  <button
                    onClick={() => handleToggleEventComplete(event)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: event.eventColor,
                      backgroundColor: event.completed
                        ? `${event.eventColor}20`
                        : "transparent",
                    }}
                  >
                    {event.completed && (
                      <Check
                        size={20}
                        style={{ color: event.eventColor }}
                      />
                    )}
                  </button>

                  {/* Title + Notes */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-base-content">
                      {event.eventTitle}

                      <span
                        className="ml-2 text-xs font-medium"
                        style={{ color: event.eventColor }}
                      >
                        ({event.eventType})
                      </span>
                    </p>

                    <p className="truncate text-sm text-base-content/60">
                      {event.notes || "No notes"}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="text-sm font-medium whitespace-nowrap">
                    {formatTimeRange(event.startTime, event.endTime)}
                  </div>

                  {/* Status */}
                  <div
                    className="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: `${event.eventColor}20`,
                      color: event.eventColor,
                    }}
                  >
                    {event.completed ? "Completed" : "Pending"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center mt-auto">
          <button className="group flex items-center gap-2 rounded-xl border border-base-content/20 px-5 py-3 text-sm font-medium text-neutral-800 transition-all hover:bg-base-200 cursor-pointer"
            onClick={() => router.push("/dashboard?tab=planner")}
          >
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

          <button className="group flex items-center gap-2 rounded-xl border border-base-content/20 px-5 py-3 text-sm font-medium text-neutral-800 transition-all hover:bg-base-200 cursor-pointer"
            onClick={() => router.push("/dashboard?tab=settings")}
          >
            View All
          </button>
        </div>

        {/* Activity List */}
        <div className="mt-5 h-40 overflow-y-auto space-y-4 pr-2 no-scrollbar">
          {coinsDataLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-base-content/60">
              Loading recent activity...
            </div>
          ) : coinsDataError ? (
            <div className="flex h-full items-center justify-center text-sm text-error">
              Failed to load recent activity.
            </div>
          ) : activityData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-base-content/60">
              No recent activity yet. Complete tasks to start earning coins.
            </div>
          ) : (
            activityData.map((activity, index) => {
              const style = TASK_STYLES[activity.type];
              const Icon = style.icon;

              return (
                <div
                  key={`${activity.task}-${index}`}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${style.color}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {activity.task}
                    </p>

                    <p className="truncate text-xs text-base-content/60">
                      {activity.notes}
                    </p>
                  </div>

                  <div className={`text-sm font-semibold ${style.color}`}>
                    {activity.coins > 0 ? "+" : ""}
                    {activity.coins}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
