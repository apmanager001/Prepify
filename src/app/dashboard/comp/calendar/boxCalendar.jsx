"use client";
import React, { useState, useEffect } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import EventModal from "./eventModal";
import { useCalendarEvents } from "./lib/calendar";
import LoadingComp from "@/lib/loading";

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-32">
        <LoadingComp />
      </div>
    );
  }

  return (
    <>
      <div className="bg-base-200 rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="btn bg-base-200 hover:bg-base-300 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="btn btn-sm bg-base-200 hover:bg-base-300 rounded-lg"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="btn bg-base-200 hover:bg-base-300 rounded-lg"
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
                className={`md:min-h-[100px] p-2 border border-base-border cursor-pointer hover:bg-base-300 transition-colors ${
                  isToday(date) ? "bg-primary" : ""
                } ${isSelected(date) ? "bg-base-300" : ""}`}
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
                            <EventIcon size={12} className="shrink-0" />
                            <div className="hidden md:flex md:flex-1 md:min-w-0">
                              <div className="flex flex-col justify-center items-start min-w-0">
                                <span
                                  className="truncate block font-medium text-xs md:text-sm text-gray-900 max-w-full"
                                  title={event.title}
                                >
                                  {event.title}
                                </span>
                                {event.time && (
                                  <span className="text-xs text-gray-600 font-bold">
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
        <EventModal
          selectedEvent={selectedEvent}
          onClose={() => setShowViewEventModal(false)}
        />
      )}
    </>
  );
};

export default BoxCalendar;
