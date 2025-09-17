import React, { useState } from "react";
import { Plus } from "lucide-react";

const LinearCalendar = ({ eventTypes, colorClasses, onAddEvent }) => {
  const [selectedDay, setSelectedDay] = useState(new Date());

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const [currentWeek, setCurrentWeek] = useState(getWeekDays(new Date()));

  const changeWeek = (direction) => {
    const newDate = new Date(currentWeek[0]);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeek(getWeekDays(newDate));
  };

  const mockEvents = [
    { time: "09:00 AM", title: "Morning Meeting" },
    { time: "11:00 AM", title: "Project Discussion" },
    { time: "02:00 PM", title: "Code Review" },
    { time: "04:00 PM", title: "Team Sync" },
  ];

  return (
    <div>
      {/* 7-Day Calendar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-2">
        <button
          className="btn btn-sm btn-primary rounded-lg"
          onClick={() => changeWeek(-1)}
        >
          &lt;
        </button>

        <div className="flex flex-wrap justify-center gap-2 flex-1">
          {currentWeek.map((day, index) => {
            const isSelected =
              selectedDay.toDateString() === day.toDateString();
            return (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`btn btn-sm text-xs py-2 transition-all duration-200 rounded-lg flex flex-col md:flex-row items-center gap-1 btn-outline ${
                  isSelected ? "bg-primary" : ""
                }`}
              >
                <span>
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span>
                  {day.toLocaleDateString("en-US", { day: "numeric" })}
                </span>
              </button>
            );
          })}
        </div>

        <button
          className="btn btn-sm btn-primary rounded-lg"
          onClick={() => changeWeek(1)}
        >
          &gt;
        </button>
      </div>
      <div className="flex justify-end m-2">
        <button
          className="btn btn-primary btn-soft rounded-2xl"
          onClick={() => onAddEvent(selectedDay)}
        >
          <Plus size={16} className="inline mr-2" />
          Add Event
        </button>
      </div>
      {/* Vertical Calendar */}
      <table className="table-auto w-full max-w-md mb-4">
        <thead>
          <tr>
            <th></th>
            <th className="text-left px-2 py-2">Time</th>
            <th className="text-left px-2 py-2">Event</th>
          </tr>
        </thead>
        {mockEvents.map((event, index) => (
          <tbody key={index}>
            <tr className="align-middle">
              <td className="px-2 py-2 text-center">
                <input type="checkbox" className="checkbox checkbox-primary" />
              </td>
              <td className="px-2 py-2 ">{event.time}</td>
              <td className="px-2 py-2">{event.title}</td>
            </tr>
            {index < mockEvents.length - 1 && (
              <tr>
                <td></td>
                <td className="w-full h-10 flex justify-left px-2 py-2">
                  <div className="divider divider-horizontal divider-primary h-10" />
                </td>
                <td></td>
              </tr>
            )}
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default LinearCalendar;
