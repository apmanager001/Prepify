import React from "react";
import { Plus } from "lucide-react";
import { Noto_Serif_Balinese } from "next/font/google";

const QuickScheduleSection = ({
  selectedDayDate,
  draft,
  setDraft,
  onSubmit,
  isSubmitting,
  plannerTypes,
  onReset,
  headerAction,
}) => {
  const selectedDayLabel =
    selectedDayDate?.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }) || "the selected day";

  
  return (
    <section className="bg-base-100 rounded-lg shadow p-4 h-full border border-base-content/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral">
            Quick Schedule
          </h2>
          <p className="text-sm text-neutral/70">
            Add a planner item for {selectedDayLabel}.
          </p>
        </div>

        {headerAction || (
          <div className="rounded-xl border border-base-content/20 bg-base-100 px-3 py-2 text-xs text-neutral/70">
            Saved on this device
          </div>
        )}
      </div>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-neutral/80 sm:col-span-2">
            Title
            <input
              type="text"
              className="input input-bordered bg-base-100 text-base-content"
              placeholder="Deep work block, Biology lecture, submit essay..."
              value={draft.title}
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  title: event.target.value,
                }))
              }
              maxLength={120}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-neutral/80">
            Type
            <select
              className="select select-bordered bg-base-100 text-base-content"
              value={draft.type}
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  type: event.target.value,
                }))
              }
            >
              {Object.entries(plannerTypes).map(([value, type]) => (
                <option key={value} value={value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm text-neutral/80">
            Date
            <input
              type="date"
              className="input input-bordered bg-base-100 text-base-content"
              value={draft.date}
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  date: event.target.value,
                }))
              }
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-neutral/80">
            Start time
            <input
              type="time"
              className="input input-bordered bg-base-100 text-base-content"
              value={draft.startTime}
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  startTime: event.target.value,
                }))
              }
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-neutral/80">
            End time
            <input
              type="time"
              className="input input-bordered bg-base-100 text-base-content"
              value={draft.endTime}
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  endTime: event.target.value,
                }))
              }
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-neutral/80 sm:col-span-2">
            Notes
            <textarea
              className="textarea textarea-bordered min-h-24 bg-base-100 text-base-content"
              placeholder="Add context, location, assignment details, or prep notes."
              value={draft.notes}
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  notes: event.target.value,
                }))
              }
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
            disabled={isSubmitting}
          >
            <Plus size={16} />
            Add to Planner
          </button>
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            Reset
          </button>
        </div>
      </form>
    </section>
  );
};

export default QuickScheduleSection;
