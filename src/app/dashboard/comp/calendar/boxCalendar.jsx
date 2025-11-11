"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useCalendarEvents, useDeleteCalendarEvent } from "./lib/calendar";
import toast from "react-hot-toast";

const BoxCalendar = ({ eventTypes, colorClasses, onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  // localEvents keeps transient client-side additions/deletes until backend sync
  const [events, setEvents] = useState({});
  const [fetchedEventsMap, setFetchedEventsMap] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [showViewEventModal, setShowViewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    time: "",
    type: "study",
    color: "blue",
  });
  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDeleteEvent = (dateKey, eventId) => {
    setEvents((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter((event) => event.id !== eventId) || [],
    }));
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const key = date.toDateString();
    const local = events[key] || [];
    const fetched = fetchedEventsMap[key] || [];
    // combine fetched events first, then local additions
    return [...fetched, ...local];
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Fetch backend events for the current month range
  const startOfMonthIso = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];
  const endOfMonthIso = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )
    .toISOString()
    .split("T")[0];

  const { data: fetchedData, isLoading } = useCalendarEvents({
    from: startOfMonthIso,
    to: endOfMonthIso,
  });

  const deleteMutation = useDeleteCalendarEvent();

  useEffect(() => {
    if (!fetchedData) return;
    // normalize fetchedData to an array of events
    let items = [];
    if (Array.isArray(fetchedData)) items = fetchedData;
    else if (Array.isArray(fetchedData.items)) items = fetchedData.items;
    else if (Array.isArray(fetchedData.data)) items = fetchedData.data;
    else if (Array.isArray(fetchedData.events)) items = fetchedData.events;
    else {
      // unexpected shape — try to log and bail
      console.warn(
        "Unexpected fetchedData shape for calendar events",
        fetchedData
      );
      items = [];
    }

    const map = {};
    // helper to pick the best date-like field from the event object
    const pickDateField = (ev) => {
      // prefer explicit scheduled/event fields, then generic ones, and only as a last resort use created timestamps
      return (
        ev.eventDate ||
        ev.event_date ||
        ev.scheduledDate ||
        ev.scheduled_date ||
        ev.startDate ||
        ev.start_date ||
        ev.date ||
        ev.datetime ||
        ev.dateTime ||
        ev.start ||
        ev.scheduledAt ||
        ev.scheduled_at ||
        ev.createdAt ||
        ev.created_at ||
        ev.created ||
        null
      );
    };

    const normalizeDate = (raw, ev) => {
      if (!raw) return null;
      const time = ev.eventTime || ev.time || ev.timeOfDay || null;
      const rawStr = String(raw);

      // If the backend sent a plain YYYY-MM-DD string, treat it as a date-only value
      // and construct a local Date at midnight for that calendar day.
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawStr)) {
        if (time) {
          // combine date-only with explicit time if provided
          const combined = `${rawStr}T${time}`;
          const d = new Date(combined);
          if (isNaN(d)) return null;
          return d;
        }
        const [y, m, d] = rawStr.split("-").map(Number);
        return new Date(y, m - 1, d);
      }

      // If the backend sent an ISO that is midnight UTC (e.g. 2025-11-19T00:00:00.000Z)
      // treat it as date-only to avoid timezone shifts that move it to the previous day
      if (/^\d{4}-\d{2}-\d{2}T00:00:00(?:\.000)?Z?$/.test(rawStr)) {
        const datePart = rawStr.split("T")[0];
        const [y, m, d] = datePart.split("-").map(Number);
        return new Date(y, m - 1, d);
      }

      // Fallback: parse as a normal datetime (keeps timezone behaviour for events with explicit times)
      const d = new Date(rawStr);
      if (isNaN(d)) return null;
      return d;
    };

    items.forEach((ev) => {
      const rawDate = pickDateField(ev);
      const dateObj = normalizeDate(rawDate, ev);
      const key = dateObj
        ? dateObj.toDateString()
        : String(rawDate || ev._id || ev.id || "");

      const item = {
        id:
          ev._id ||
          ev.id ||
          `${String(rawDate || ev.date || ev._id || ev.id)}-${
            ev.eventTime || ev.time || ""
          }-${ev.eventTitle || ev.title || ""}`,
        title: ev.eventTitle || ev.title || "(no title)",
        description: ev.eventDescription || ev.description || "",
        time: ev.eventTime || ev.time || "",
        type: ev.eventType || ev.type || "study",
        color: ev.eventColor || ev.color || "blue",
        createdAt: ev.createdAt || ev.created_at || ev.created || null,
        _raw: ev,
      };

      map[key] = map[key] || [];
      map[key].push(item);
    });
    setFetchedEventsMap(map);
  }, [fetchedData]);

  // const handleAddEvent = () => {
  //   if (!selectedDate || !newEvent.title.trim()) return;

  //   const dateKey = selectedDate.toDateString();
  //   const eventWithId = {
  //     ...newEvent,
  //     id: Date.now(),
  //     date: selectedDate,
  //   };

  //   setEvents((prev) => ({
  //     ...prev,
  //     [dateKey]: [...(prev[dateKey] || []), eventWithId],
  //   }));

  //   setNewEvent({
  //     title: "",
  //     description: "",
  //     time: "",
  //     type: "study",
  //     color: "blue",
  //   });
  //   setShowEventModal(false);
  //   setSelectedDate(null);
  // };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {getDaysInMonth(currentDate).map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const hasEvents = dayEvents.length > 0;
            // console.log(dayEvents);
            return (
              <div
                key={index}
                className={`md:min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isToday(date) ? "bg-blue-50 border-blue-200" : ""
                } ${isSelected(date) ? "bg-blue-100 border-blue-300" : ""}`}
                onClick={() => {
                  handleDateClick(date);
                  onAddEvent(date);
                }}
              >
                {date && (
                  <>
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isToday(date) ? "text-blue-600" : "text-gray-900"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => {
                        const EventIcon =
                          eventTypes[event.type]?.icon || BookOpen;
                        return (
                          <div
                            key={event.id}
                            style={{ backgroundColor: event.color }}
                            className={`text-xs p-1 rounded border ${
                              colorClasses[event.color]
                            } flex items-center space-x-1`}
                            onClick={(e) => {
                              // don't let the parent date cell click fire (which opens add event)
                              e.stopPropagation();
                              setSelectedEvent(event);
                              setShowViewEventModal(true);
                            }}
                          >
                            <EventIcon size={12} className="flex-shrink-0" />
                            <div className="hidden md:flex md:flex-1 md:min-w-0">
                              <div className="flex flex-col justify-center items-start">
                                <span className="truncate font-medium text-xs md:text-sm text-gray-900">
                                  {event.title}
                                </span>
                                {event.time && (
                                  <span className="text-xs text-gray-600">
                                    {event.time}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* View Event Modal */}
      {showViewEventModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 mx-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center">
                  {selectedEvent.title || "Event"}
                </h3>
                <span className="text-sm text-gray-500 ml-2">
                  created on{" "}
                  {(() => {
                    const raw =
                      selectedEvent?.createdAt ||
                      selectedEvent?._raw?.createdAt ||
                      selectedEvent?._raw?.created_at ||
                      selectedEvent?._raw?.created ||
                      null;
                    if (!raw) return "—";
                    try {
                      // show only the date portion (no time)
                      return new Date(raw).toLocaleDateString();
                    } catch (e) {
                      return String(raw);
                    }
                  })()}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowViewEventModal(false);
                  setSelectedEvent(null);
                }}
                aria-label="Close"
                className="btn btn-circle btn-ghost"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">Time</div>
                <div className="text-sm">{selectedEvent.time || "—"}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Type</div>
                <div className="text-sm">{selectedEvent.type || "—"}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Description</div>
                <div className="text-sm whitespace-pre-wrap">
                  {selectedEvent.description || "No description"}
                </div>
              </div>

              {/* <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowViewEventModal(false);
                    setSelectedEvent(null);
                  }}
                  className="btn btn-secondary btn-soft rounded-3xl"
                >
                  Close
                </button>
              </div> */}
              <div className="flex justify-end">
                <button
                  onClick={async () => {
                    if (!selectedEvent || !selectedEvent.id) return;
                    const ok = window.confirm(
                      "Delete this event? This cannot be undone."
                    );
                    if (!ok) return;
                    try {
                      await deleteMutation.mutateAsync(selectedEvent.id);
                      // close modal on success
                      setShowViewEventModal(false);
                      setSelectedEvent(null);
                      toast.success("Event deleted");
                    } catch (err) {
                      console.error("Failed to delete event", err);
                      // optionally show a user-visible error here
                    }
                  }}
                  className={`btn btn-error btn-soft rounded-3xl text-error hover:text-white ${
                    deleteMutation.isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={deleteMutation.isLoading}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoxCalendar;
