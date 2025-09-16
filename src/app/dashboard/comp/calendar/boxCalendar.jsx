'use client';
import React, {useState} from 'react'
import {
  Calendar as CalendarIcon,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BoxCalendar = ({eventTypes, colorClasses, onAddEvent}) => {
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

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                isToday(date) ? "bg-blue-50 border-blue-200" : ""
              } ${isSelected(date) ? "bg-blue-100 border-blue-300" : ""}`}
              onClick={() => { handleDateClick(date); onAddEvent(date); }}
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

      </>
 );

}






export default BoxCalendar