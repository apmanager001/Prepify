"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Roboto } from "next/font/google";
import toast from "react-hot-toast";
import {
  Calendar as CalendarIcon,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  GripVertical,
  Notebook,
  Plus,
  Target,
  Trash2,
  X,
} from "lucide-react";
import LoadingComp from "@/lib/loading";
import {
  useAddCalendarEvent,
  useCalendarEvents,
  useDeleteCalendarEvent,
  useUpdateCalendarEvent,
} from "../calendar/lib/calendar";
import DayAgendaSection from "./dayAgendaSection";
import QuickScheduleSection from "./quickScheduleSection";
import StatsBadge from "./statsBadge";

const plannerFont = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const PLANNER_META_STORAGE_KEY = "prepify-planner-meta";
const PLANNER_TYPES = {
  study: { label: "Study Session", color: "#3b82f6" },
  class: { label: "Class", color: "#fdc135" },
  assignment: { label: "Assignment / Deadline", color: "#ef4444" },
  reminder: { label: "Reminder", color: "#10b981" },
  personal: { label: "Personal Task", color: "#6b7280" },
};

const toDateKey = (value) => {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fromDateKey = (dateKey) => {
  if (!dateKey) return null;
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
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

const extractCalendarItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const normalizeEventDate = (event) => {
  const raw =
    event?.eventDate ||
    event?.event_date ||
    event?.scheduledDate ||
    event?.scheduled_date ||
    event?.startDate ||
    event?.start_date ||
    event?.date ||
    event?.datetime ||
    event?.dateTime ||
    event?.start ||
    event?.scheduledAt ||
    event?.scheduled_at ||
    event?.createdAt ||
    event?.created_at ||
    event?.created ||
    null;

  if (!raw) return null;

  const rawString = String(raw);

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawString)) {
    const [year, month, day] = rawString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  if (/^\d{4}-\d{2}-\d{2}T00:00:00(?:\.000)?Z?$/.test(rawString)) {
    const [year, month, day] = rawString.split("T")[0].split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(rawString);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getStartTime = (event, normalizedDate) => {
  const explicitTime =
    event?.startTime ||
    event?.eventTime ||
    event?.time ||
    event?.timeOfDay ||
    "";
  if (explicitTime) return explicitTime;

  if (!normalizedDate) return "";

  const hours = normalizedDate.getHours();
  const minutes = normalizedDate.getMinutes();
  if (hours === 0 && minutes === 0) return "";
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const getPlannerMetaKey = ({ id, title, date, startTime }) =>
  id || `${title}__${date}__${startTime || "anytime"}`;

const parseTimeToMinutes = (value) => {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

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

const formatTimeRange = (startTime, endTime) => {
  if (startTime && endTime) {
    return `${formatTimeValue(startTime)} - ${formatTimeValue(endTime)}`;
  }

  if (startTime) {
    return formatTimeValue(startTime);
  }

  return "Any time";
};

const formatMinutes = (minutes) => {
  if (!minutes) return "0h";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) return `${remainingMinutes}m`;
  if (!remainingMinutes) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

const createDraft = (dateKey) => ({
  title: "",
  date: dateKey,
  startTime: "09:00",
  endTime: "10:00",
  type: "study",
  notes: "",
});

const PlannerStatCard = ({ icon: Icon, label, value, subValue }) => (
  <div className="customContainer p-4">
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border-3 border-primary bg-neutral text-neutral-content">
        <Icon />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-neutral-content/80">
          {label}
        </div>
        <div className="mt-1 text-2xl font-extrabold text-neutral-content">
          {value}
        </div>
        <div className="mt-1 text-xs text-neutral-content/70">{subValue}</div>
      </div>
    </div>
  </div>
);

const Planner = () => {
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const [weekAnchor, setWeekAnchor] = useState(() =>
    getStartOfWeek(new Date()),
  );
  const [selectedDayKey, setSelectedDayKey] = useState(todayKey);
  const [plannerMeta, setPlannerMeta] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [draft, setDraft] = useState(() => createDraft(todayKey));
  const [isQuickScheduleOpen, setIsQuickScheduleOpen] = useState(false);
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);

  const weekDays = useMemo(() => getWeekDays(weekAnchor), [weekAnchor]);
  const from = toDateKey(weekDays[0]);
  const to = toDateKey(weekDays[6]);

  const { data, isLoading, isError } = useCalendarEvents({
    from,
    to,
    page: 1,
    pageSize: 200,
  });
  const addEventMutation = useAddCalendarEvent();
  const deleteEventMutation = useDeleteCalendarEvent();
  const updateEventMutation = useUpdateCalendarEvent();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PLANNER_META_STORAGE_KEY);
      if (!stored) return;
      // One-time hydration from localStorage after mount; this must run
      // client-side only, so it can't be a lazy useState initializer
      // (that would cause an SSR/hydration mismatch).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlannerMeta(JSON.parse(stored));
    } catch (error) {
      console.error("Failed to load planner metadata", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        PLANNER_META_STORAGE_KEY,
        JSON.stringify(plannerMeta),
      );
    } catch (error) {
      console.error("Failed to save planner metadata", error);
    }
  }, [plannerMeta]);

  // Keep the draft's date in sync with the selected day, without an effect.
  const [prevSelectedDayKey, setPrevSelectedDayKey] = useState(selectedDayKey);
  if (selectedDayKey !== prevSelectedDayKey) {
    setPrevSelectedDayKey(selectedDayKey);
    setDraft((currentDraft) => ({
      ...currentDraft,
      date: selectedDayKey,
    }));
  }

  const plannerItems = useMemo(() => {
    return extractCalendarItems(data)
      .map((event) => {
        const normalizedDate = normalizeEventDate(event);
        const baseDateKey = normalizedDate ? toDateKey(normalizedDate) : "";
        const title = event?.eventTitle || event?.title || "Untitled item";
        const startTime = getStartTime(event, normalizedDate);
        const endTime = event?.endTime || event?.eventEndTime || "";
        const notes = event?.notes || event?.note || event?.eventNotes || "";
        const id = event?._id || event?.id || event?.eventId || null;
        const metaKey = getPlannerMetaKey({
          id,
          title,
          date: baseDateKey,
          startTime,
        });
        const meta = plannerMeta[metaKey] || {};
        const type = event?.eventType || event?.type || "study";

        const completed =
          meta.completed !== undefined
            ? Boolean(meta.completed)
            : Boolean(event?.completed);

        return {
          id,
          metaKey,
          title,
          // description: event?.eventDescription || event?.description || "",
          date: meta.overrideDate || baseDateKey,
          startTime,
          endTime: meta.endTime || endTime,
          notes,
          type,
          color:
            event?.eventColor ||
            PLANNER_TYPES[type]?.color ||
            PLANNER_TYPES.study.color,
          completed,
        };
      })
      .filter((item) => item.date)
      .sort((left, right) => {
        if (left.date !== right.date) {
          return left.date.localeCompare(right.date);
        }

        const leftTime = parseTimeToMinutes(left.startTime);
        const rightTime = parseTimeToMinutes(right.startTime);

        if (leftTime === null && rightTime === null) {
          return left.title.localeCompare(right.title);
        }

        if (leftTime === null) return 1;
        if (rightTime === null) return -1;
        return leftTime - rightTime;
      });
  }, [data, plannerMeta]);

  const eventsByDay = useMemo(() => {
    return weekDays.reduce((accumulator, day) => {
      const dayKey = toDateKey(day);
      accumulator[dayKey] = plannerItems.filter((item) => item.date === dayKey);
      return accumulator;
    }, {});
  }, [plannerItems, weekDays]);

  const selectedDayDate = fromDateKey(selectedDayKey);
  const selectedDayItems = eventsByDay[selectedDayKey] || [];
  const selectedDayLabel =
    selectedDayDate?.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }) || "the selected day";
  const completedCount = plannerItems.filter((item) => item.completed).length;
  const studyCount = plannerItems.filter(
    (item) => item.type === "study",
  ).length;
  const scheduledMinutes = plannerItems.reduce((total, item) => {
    const startMinutes = parseTimeToMinutes(item.startTime);
    const endMinutes = parseTimeToMinutes(item.endTime);

    if (
      startMinutes === null ||
      endMinutes === null ||
      endMinutes <= startMinutes
    ) {
      return total;
    }

    return total + (endMinutes - startMinutes);
  }, 0);

  const selectedDayStudyMinutes = selectedDayItems.reduce((total, item) => {
    const startMinutes = parseTimeToMinutes(item.startTime);
    const endMinutes = parseTimeToMinutes(item.endTime);

    if (
      startMinutes === null ||
      endMinutes === null ||
      endMinutes <= startMinutes
    ) {
      return total;
    }

    return total + (endMinutes - startMinutes);
  }, 0);

  const weekRangeLabel = `${weekDays[0].toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${weekDays[6].toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;

  const updatePlannerMeta = (metaKey, nextValues) => {
    setPlannerMeta((currentMeta) => ({
      ...currentMeta,
      [metaKey]: {
        ...currentMeta[metaKey],
        ...nextValues,
      },
    }));
  };

  const removePlannerMeta = (metaKey) => {
    setPlannerMeta((currentMeta) => {
      if (!currentMeta[metaKey]) return currentMeta;

      const nextMeta = { ...currentMeta };
      delete nextMeta[metaKey];
      return nextMeta;
    });
  };

  const handleWeekChange = (direction) => {
    const nextStart = new Date(weekAnchor);
    nextStart.setDate(nextStart.getDate() + direction * 7);

    const weekdayIndex = weekDays.findIndex(
      (day) => toDateKey(day) === selectedDayKey,
    );
    const normalizedIndex = weekdayIndex >= 0 ? weekdayIndex : 0;
    const nextSelectedDay = new Date(nextStart);
    nextSelectedDay.setDate(nextStart.getDate() + normalizedIndex);

    setWeekAnchor(nextStart);
    setSelectedDayKey(toDateKey(nextSelectedDay));
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setWeekAnchor(getStartOfWeek(today));
    setSelectedDayKey(toDateKey(today));
  };

  const handleAddPlannerItem = async (event) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      toast.error("Add a title for the planner item");
      return;
    }

    if (draft.endTime && draft.startTime && draft.endTime <= draft.startTime) {
      toast.error("End time needs to be after the start time");
      return;
    }

    const payload = {
      eventTitle: draft.title.trim(),
      eventDate: draft.date,
      startTime: draft.startTime,
      endTime: draft.endTime,
      eventType: draft.type,
      eventColor: PLANNER_TYPES[draft.type]?.color || PLANNER_TYPES.study.color,
      notes: draft.notes.trim(),
    };

    try {
      const created = await addEventMutation.mutateAsync(payload);
      const createdId =
        created?._id ||
        created?.id ||
        created?.event?._id ||
        created?.event?.id ||
        null;

      const metaKey = getPlannerMetaKey({
        id: createdId,
        title: payload.eventTitle,
        date: payload.eventDate,
        startTime: payload.startTime,
      });

      updatePlannerMeta(metaKey, {
        endTime: draft.endTime,
        completed: false,
      });
      setDraft(createDraft(draft.date));
      setIsQuickScheduleOpen(false);
    } catch (error) {
      console.error("Failed to create planner item", error);
      toast.error("Failed to add planner item");
    }
  };

  const handleDeleteItem = async (item) => {
    if (!item.id) {
      removePlannerMeta(item.metaKey);
      return;
    }

    try {
      await deleteEventMutation.mutateAsync(item.id);
      removePlannerMeta(item.metaKey);
      toast.success("Planner item deleted");
    } catch (error) {
      console.error("Failed to delete planner item", error);
      toast.error("Failed to delete planner item");
    }
  };

  const handleToggleComplete = async (item) => {
    const nextCompleted = !item.completed;
    updatePlannerMeta(item.metaKey, {
      completed: nextCompleted,
    });

    if (!item.id) return;

    try {
      await updateEventMutation.mutateAsync({
        id: item.id,
        eventPayload: {
          completed: nextCompleted,
        },
      });
      toast.success(
        nextCompleted
          ? "Task Completed"
          : "Task marked as incomplete",
      );
    } catch (error) {
      updatePlannerMeta(item.metaKey, {
        completed: item.completed,
      });
      console.error("Failed to update planner item completion", error);
      toast.error("Failed to update planner item");
    }
  };

  const handleDropOnDay = async (dayKey) => {
    if (!draggedItem) return;
    const { id, metaKey } = draggedItem;

    updatePlannerMeta(metaKey, { overrideDate: dayKey });
    setSelectedDayKey(dayKey);
    setDraggedItem(null);

    if (!id) return;

    try {
      await updateEventMutation.mutateAsync({
        id,
        eventPayload: {
          eventDate: dayKey,
        },
      });
      toast.success("Event date changed");
    } catch (error) {
      console.error("Failed to update planner event date", error);
      toast.error("Failed to update event date");
    }
  };

  const stats = [
    {
      id: 1,
      icon: <CalendarIcon />,
      label: "Planned This Week",
      value: plannerItems.length,
      subValue: `${studyCount} study session${studyCount === 1 ? "" : "s"}`,
      trend: studyCount > 0 ? "positive" : "neutral",
    },
    {
      id: 2,
      icon: <CheckSquare />,
      label: "Completed",
      value: completedCount,
      subValue: `${Math.max(plannerItems.length - completedCount, 0)} remaining`,
      trend: completedCount > 0 ? "positive" : "neutral",
    },
    {
      id: 3,
      icon: <Clock />,
      label: "Scheduled Hours",
      value: formatMinutes(scheduledMinutes),
      subValue: "Based on planner start and end time",
      trend: "neutral",
    },
    {
      id: 4,
      icon: <Target />,
      label: "Selected Day",
      value: selectedDayItems.length,
      subValue: `${formatMinutes(selectedDayStudyMinutes)} planned for ${selectedDayDate?.toLocaleDateString("en-US", { weekday: "long" }) || "today"}`,
      trend: selectedDayStudyMinutes > 0 ? "positive" : "neutral",
    },
  ];

  return (
    <div
      className={`flex flex-col gap-4 mb-24 xl:mb-10 ${plannerFont.className}`}
    >
      <header className="headerContainer relative flex items-center justify-between overflow-visible">
        <div>
          <div className="text-neutral text-sm font-medium flex items-center gap-2">
            <div className="flex items-center text-neutral-content text-lg border-3 border-primary bg-neutral p-2 rounded-xl hover:scale-105">
              <Notebook />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-neutral-content uppercase tracking-wide">
                Planner
              </span>
              <div className="text-sm text-neutral-content/80">
                Schedule classes, study sessions, reminders, and day-to-day
                tasks in one place.
              </div>
            </div>
          </div>
        </div>
        <Image
          src="./headerImages/planner.webp"
          alt="Planner Illustration"
          width={250}
          height={200}
          className="hidden md:block absolute bottom-0 right-2 w-60 h-22"
        />
      </header>
      <StatsBadge stats={stats} />
      {isError && (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Planner events could not be loaded. You can still prepare items, but
          the schedule may be incomplete.
        </div>
      )}

      <div className="space-y-4">
        <section className="bg-base-100 rounded-lg shadow p-2 h-full border border-base-content/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral">
                Planner Actions
              </h2>
              <p className="text-sm text-neutral/70">
                Create new items or review the agenda for {selectedDayLabel}{" "}
                before arranging the week.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsQuickScheduleOpen(true)}
              >
                <Plus size={16} />
                Add Schedule
              </button>
              <button
                type="button"
                className="btn btn-accent btn-soft"
                onClick={() => setIsAgendaOpen((currentValue) => !currentValue)}
              >
                <CalendarIcon size={16} />
                Day Agenda
                <span className="badge badge-neutral badge-sm">
                  {selectedDayItems.length}
                </span>
              </button>
            </div>
          </div>
        </section>

        {isAgendaOpen && (
          <DayAgendaSection
            selectedDayDate={selectedDayDate}
            selectedDayItems={selectedDayItems}
            onJumpToToday={handleJumpToToday}
            onToggleComplete={handleToggleComplete}
            onDeleteItem={handleDeleteItem}
            isDeleting={deleteEventMutation.isPending}
            plannerTypes={PLANNER_TYPES}
            formatTimeRange={formatTimeRange}
          />
        )}

        <section className="bg-base-100 rounded-lg shadow p-2 h-full border border-base-content/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral">Weekly Planner</h2>
              <p className="text-sm text-neutral/70">
                Drag cards between days to reorganize the week. Completion and
                end times stay with the item in Planner.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-sm bg-base-200 hover:bg-base-300 rounded-lg"
                onClick={() => handleWeekChange(-1)}
                aria-label="Previous week"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="rounded-xl border border-base-content/15 bg-base-100 px-4 py-2 text-xs xl:text-sm font-semibold text-base-content">
                {weekRangeLabel}
              </div>
              <button
                type="button"
                className="btn btn-sm bg-base-200 hover:bg-base-300 rounded-lg"
                onClick={() => handleWeekChange(1)}
                aria-label="Next week"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center">
              <LoadingComp />
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4 2xl:grid-cols-7">
              {weekDays.map((day) => {
                const dayKey = toDateKey(day);
                const items = eventsByDay[dayKey] || [];
                const isSelectedDay = dayKey === selectedDayKey;

                return (
                  <div
                    key={dayKey}
                    className={`rounded-2xl border p-3 transition-colors ${
                      isSelectedDay
                        ? "border-primary bg-base-100/80"
                        : "border-base-content/15 bg-base-100/55"
                    }`}
                    onClick={() => setSelectedDayKey(dayKey)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleDropOnDay(dayKey);
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                          {day.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="text-lg font-extrabold text-base-content">
                          {day.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      {/* <div
                        className="badge badge-neutral min-w-24"
                        // className="rounded-full border border-base-content/15 bg-base-200/60 px-2 py-1 text-xs text-base-content/70"
                      >
                        {items.length} item{items.length === 1 ? "" : "s"}
                      </div> */}
                    </div>
                    <div
                      className="badge badge-neutral min-w-24"
                      // className="rounded-full border border-base-content/15 bg-base-200/60 px-2 py-1 text-xs text-base-content/70"
                    >
                      {items.length} item{items.length === 1 ? "" : "s"}
                    </div>
                    <div className="mt-3 flex min-h-44 flex-col gap-2">
                      {items.length === 0 ? (
                        <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-base-content/20 bg-base-200/25 px-3 text-center text-xs text-base-content/55">
                          Drop a planner item here
                        </div>
                      ) : (
                        items.map((item) => (
                          <article
                            key={`${item.metaKey}-${dayKey}`}
                            draggable
                            onDragStart={(event) => {
                              setDraggedItem(item);
                              event.dataTransfer.effectAllowed = "move";
                            }}
                            onDragEnd={() => setDraggedItem(null)}
                            className={`cursor-grab rounded-xl border border-base-content/15 bg-neutral hover:shadow-lg p-3 active:cursor-grabbing ${
                              item.completed ? "opacity-70" : "tooltip"
                            }`}
                            style={{
                              borderTopWidth: 10,
                              borderTopColor: item.color,
                            }}
                            data-tip={item.notes || "No additional details"}
                          >
                            <div className="flex justify-around w-full gap-2">
                              <div className="flex flex-col items-center justify-between gap-1 cursor-default ">
                                <GripVertical size={16} color={item.color} className='cursor-grab'/>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-xs btn-circle text-error"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleDeleteItem(item);
                                  }}
                                  disabled={deleteEventMutation.isPending}
                                  aria-label={`Delete ${item.title}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div
                                  className={`text-sm font-semibold text-neutral-200 ${item.completed ? "line-through" : ""}`}
                                >
                                  {item.title}
                                </div>
                                <div className="text-xs text-neutral-300">
                                  {PLANNER_TYPES[item.type]?.label || item.type}
                                </div>
                                <div className="mt-1 text-[10px] text-neutral-400">
                                  {formatTimeRange(
                                    item.startTime,
                                    item.endTime,
                                  )}
                                </div>
                              </div>
                              <div className="text-base-content/40 flex flex-col justify-center items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-sm checkbox-success mt-1"
                                  checked={item.completed}
                                  onClick={(event) => event.stopPropagation()}
                                  onChange={() => handleToggleComplete(item)}
                                  aria-label={`Mark ${item.title} as complete`}
                                />
                              </div>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {isQuickScheduleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={() => setIsQuickScheduleOpen(false)}
        >
          <div
            className="w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <QuickScheduleSection
              selectedDayDate={selectedDayDate}
              draft={draft}
              setDraft={setDraft}
              onSubmit={handleAddPlannerItem}
              isSubmitting={addEventMutation.isPending}
              plannerTypes={PLANNER_TYPES}
              onReset={() => setDraft(createDraft(selectedDayKey))}
              headerAction={
                <div className="flex items-center gap-2">
                  {/* <div className="hidden rounded-xl border border-base-content/20 bg-base-100 px-3 py-2 text-xs text-base-content/70 sm:block">
                    Saved on this device
                  </div> */}
                  <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost"
                    onClick={() => setIsQuickScheduleOpen(false)}
                    aria-label="Close quick schedule"
                  >
                    <X size={18} />
                  </button>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
