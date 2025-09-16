import React, { useState } from "react";

const LinearCalendar = ({ eventTypes, colorClasses }) => {
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
      <div className="flex items-center mb-4">
        <button
          className="btn btn-soft btn-primary"
          onClick={() => changeWeek(-1)}
        >
          &lt;
        </button>
        <div className="flex justify-center gap-2 flex-1">
          {currentWeek.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(day)}
              className={`btn btn-sm ${
                selectedDay.toDateString() === day.toDateString()
                  ? "btn-primary"
                  : "btn-outline"
              }`}
            >
              {day.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
              })}
            </button>
          ))}
        </div>
        <button
          className="btn btn-soft btn-primary"
          onClick={() => changeWeek(1)}
        >
          &gt;
        </button>
      </div>

      {/* Vertical Calendar */}
      {/* <div className="flex flex-col items-center">
        {mockEvents.map((event, index) => (
          //   <React.Fragment key={index}>
          //     <div className="flex items-center gap-4 w-full max-w-md justify-center">
          //       <input type="checkbox" className="checkbox checkbox-primary" />
          //       <span className="w-20 text-right">{event.time}</span>
          //       <div className="flex-1">{event.title}</div>
          //     </div>

          //     {index < mockEvents.length - 1 && (
          //       <div className="w-full flex justify-center">
          //         <div className="w-1 h-10 bg-primary" />
          //       </div>
          //     )}
          //   </React.Fragment>
        ))}
      </div> */}
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
                        <div 
                            className="divider divider-horizontal divider-primary h-10"
                        />
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
