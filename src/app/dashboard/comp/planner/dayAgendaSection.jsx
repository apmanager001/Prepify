import React from "react";
import { Trash2 } from "lucide-react";

const DayAgendaSection = ({
  selectedDayDate,
  selectedDayItems,
  onJumpToToday,
  onToggleComplete,
  onDeleteItem,
  isDeleting,
  plannerTypes,
  formatTimeRange,
}) => {
  const agendaLabel =
    selectedDayDate?.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }) || "No day selected";

  return (
    <section className="bg-base-100 rounded-lg shadow p-2 h-full border border-base-content/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral">Day Agenda</h2>
          <p className="text-sm text-neutral/70">{agendaLabel}</p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={onJumpToToday}
        >
          Today
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {selectedDayItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-base-content/25 bg-black/80 text-neutral-200 p-4 text-sm">
            No planner items yet. Add one with Quick Schedule or drop an item
            here from another day.
          </div>
        ) : (
          selectedDayItems.map((item) => (
            <article
              key={`${item.metaKey}-agenda`}
              className={`rounded-xl border border-base-content/15 bg-black/80 p-3`}
              style={{ borderLeftWidth: 10, borderLeftColor: item.color }}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-success mt-1"
                  checked={item.completed}
                  onChange={() => onToggleComplete(item)}
                  aria-label={`Mark ${item.title} as complete`}
                />

                <div className="min-w-0 flex-1">
                  <div
                    className={`font-semibold text-neutral-200 ${item.completed ? "line-through" : ""}`}
                  >
                    {item.title}
                  </div>
                  <div className="text-xs text-neutral-300">
                    {plannerTypes[item.type]?.label || item.type}
                  </div>
                  <div className="mt-1 text-[10px] text-neutral-400">
                    {formatTimeRange(item.startTime, item.endTime)}
                  </div>
                  {item.notes && (
                    <div className="mt-2 whitespace-pre-wrap text-sm text-neutral-300">
                      {item.notes}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-circle text-error"
                  onClick={() => onDeleteItem(item)}
                  disabled={isDeleting}
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default DayAgendaSection;
