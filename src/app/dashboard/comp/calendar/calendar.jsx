"use client";
import React, { useState } from "react";
import BoxCalendar from "./boxCalendar";
import LinearCalendar from './linearCalendar';
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Users,
  Target,
  Box,
} from "lucide-react";

const Calendar = () => {
  const [calendarSelect, setCalendarSelect] = useState(true);
 

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Study Calendar
          </h1>
          <p className="text-lg text-gray-600">
            Plan and schedule your study sessions, exams, and study groups
          </p>
        </div>
        <div>
          <button
            onClick={() => setCalendarSelect(!calendarSelect)}
            className="btn btn-primary rounded-2xl"
          >
            Toggle Calendar View
          </button>
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
        <BoxCalendar eventTypes={eventTypes} colorClasses={colorClasses}/>
      ) : (
        <LinearCalendar eventTypes={eventTypes} colorClasses={colorClasses}/>
      )}
    </div>
  );
};

export default Calendar;
