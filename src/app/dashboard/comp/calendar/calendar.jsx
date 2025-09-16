"use client";
import React, { useState } from "react";
import BoxCalendar from "./boxCalendar";
import LinearCalendar from './linearCalendar';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Users,
  Target,
  List,
} from "lucide-react";

const Calendar = () => {
  const [calendarSelect, setCalendarSelect] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({
      title: "",
      description: "",
      time: "",
      type: "study",
      color: "blue",
  });
 
  const handleAddEvent = (date) => {
    setShowEventModal(true);
    setSelectedDate(date);
  };

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



  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Study Calendar
          </h1>
          <p className="text-lg text-gray-600">
            Plan and schedule your study sessions, exams, and study groups
          </p>
        </div>
        {/* <div className="tooltip tooltip-left" data-tip={calendarSelect ? "Switch to List View" : "Switch to Calendar View"}>
          <button
            onClick={() => setCalendarSelect(!calendarSelect)}
            className="btn btn-primary rounded-2xl "
          >
            {calendarSelect ? <List /> : <CalendarIcon />}
          </button>
        </div> */}

        {/* <label className="toggle text-base-content w-24">
          <input
            type="checkbox"
            className="toggle toggle-lg"
            onClick={() => setCalendarSelect(!calendarSelect)}
          />
          <List strokeWidth={4} />
          <CalendarIcon strokeWidth={4} />
        </label> */}
        <div
          className="tooltip tooltip-left"
          data-tip={
            calendarSelect ? "Switch to List View" : "Switch to Calendar View"
          }
        >
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="bg-primary p-5 rounded-lg "
              checked={calendarSelect}
              onChange={() => setCalendarSelect(!calendarSelect)}
            />
            <div className="swap-on flex justify-center items-center">
              <List strokeWidth={4} className="w-6 h-6 text-secondary" />
            </div>
            <div className="swap-off flex justify-center items-center">
              <CalendarIcon strokeWidth={4} className="w-6 h-6 text-secondary" />
            </div>
          </label>
        </div>
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

      {calendarSelect ? (
        <BoxCalendar
          eventTypes={eventTypes}
          colorClasses={colorClasses}
          onAddEvent={handleAddEvent}
        />
      ) : (
        <LinearCalendar
          eventTypes={eventTypes}
          colorClasses={colorClasses}
          onAddEvent={handleAddEvent}
        />
      )}
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
                <label
                  htmlFor="eventTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="eventDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="eventTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="eventType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="eventColor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
