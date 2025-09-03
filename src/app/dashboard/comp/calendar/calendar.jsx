"use client";
import React, { useState } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Users,
  Target,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    time: "",
    type: "study",
    color: "blue",
  });

  const eventTypes = {
    study: { label: "Study Session", icon: BookOpen, color: "blue" },
    exam: { label: "Exam", icon: Target, color: "red" },
    group: { label: "Group Study", icon: Users, color: "green" },
    reminder: { label: "Reminder", icon: Clock, color: "yellow" },
  };

  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    red: "bg-red-100 text-red-800 border-red-200",
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

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
      setShowEventModal(true);
    }
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title.trim()) return;

    const dateKey = selectedDate.toDateString();
    const eventWithId = {
      ...newEvent,
      id: Date.now(),
      date: selectedDate,
    };

    setEvents((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), eventWithId],
    }));

    setNewEvent({
      title: "",
      description: "",
      time: "",
      type: "study",
      color: "blue",
    });
    setShowEventModal(false);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (dateKey, eventId) => {
    setEvents((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter((event) => event.id !== eventId) || [],
    }));
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events[date.toDateString()] || [];
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Study Calendar
        </h1>
        <p className="text-lg text-gray-600">
          Plan and schedule your study sessions, exams, and study groups
        </p>
      </div>
    {/* Event Types Legend */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Event Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(eventTypes).map(([key, type]) => {
            const Icon = type.icon;
            return (
              <div key={key} className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${colorClasses[type.color]}`}>
                  <Icon size={16} />
                </div>
                <span className="text-sm text-gray-600">{type.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Calendar Header */}
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

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isToday(date) ? "bg-blue-50 border-blue-200" : ""
                } ${isSelected(date) ? "bg-blue-100 border-blue-300" : ""}`}
                onClick={() => handleDateClick(date)}
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
                            className={`text-xs p-1 rounded border ${
                              colorClasses[event.color]
                            } flex items-center space-x-1`}
                          >
                            <EventIcon size={10} />
                            <span className="truncate">{event.title}</span>
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

      

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-base-300 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Event - {selectedDate?.toLocaleDateString()}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  id="eventTitle"
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 input input-primary rounded-lg "
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="eventDescription"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 textarea textarea-primary rounded-lg"
                  rows={3}
                  placeholder="Enter event description"
                />
              </div>

              <div>
                <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  id="eventTime"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg input input-primary"
                />
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  id="eventType"
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg select select-primary"
                >
                  {Object.entries(eventTypes).map(([key, type]) => (
                    <option key={key} value={key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="eventColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex space-x-2">
                  {Object.keys(colorClasses).map((color) => (
                    <button
                      key={color}
                      id="eventColor"
                      onClick={() =>
                        setNewEvent((prev) => ({ ...prev, color }))
                      }
                      className={`cursor-pointer w-8 h-8 rounded-full border-2 ${
                        newEvent.color === color
                          ? "border-gray-400"
                          : "border-gray-200"
                      } ${colorClasses[color].split(" ")[0]}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEventModal(false)}
                className="cursor-pointer flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="cursor-pointer flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
