import React, { useState, useEffect } from "react";
import { Plus, Clock } from "lucide-react";
import { useCalendarEvents } from "./lib/calendar";
import EventModal from "./eventModal";
import LoadingComp from "@/lib/loading";

// Inline delete button component for the linear calendar modal
// function DeleteButtonLinear({ selectedEvent, onClose }) {
//   const deleteMutation = useDeleteCalendarEvent();
//   return (
//     <button
//       onClick={async () => {
//         if (!selectedEvent || !selectedEvent.id) return;
//         const ok = window.confirm("Delete this event? This cannot be undone.");
//         if (!ok) return;
//         try {
//           await deleteMutation.mutateAsync(selectedEvent.id);
//           toast.success("Event deleted");
//           onClose && onClose();
//         } catch (err) {
//           console.error("Failed to delete event", err);
//           toast.error("Failed to delete event");
//         }
//       }}
//       className={`btn btn-error btn-soft rounded-3xl text-error hover:text-white ${
//         deleteMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
//       }`}
//       disabled={deleteMutation.isLoading}
//     >
//       <Trash2 size={18} />
//     </button>
//   );
// }

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
  const [fetchedMap, setFetchedMap] = useState({});
  const [showViewEventModal, setShowViewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // use React Query to fetch events for the current week (from/to)
  const from = currentWeek[0].toISOString().split("T")[0];
  const to = currentWeek[6].toISOString().split("T")[0];
  const { data: fetchedData, isLoading } = useCalendarEvents({ from, to });

  useEffect(() => {
    if (!fetchedData) return;
    let items = [];
    if (Array.isArray(fetchedData)) items = fetchedData;
    else if (Array.isArray(fetchedData.items)) items = fetchedData.items;
    else if (Array.isArray(fetchedData.data)) items = fetchedData.data;
    else if (Array.isArray(fetchedData.events)) items = fetchedData.events;
    else {
      // unexpected shape — bail
      console.warn(
        "Unexpected fetchedData shape for linear calendar",
        fetchedData
      );
      items = [];
    }

    const map = {};
    const pickDateField = (ev) =>
      ev.eventDate ||
      ev.event_date ||
      ev.date ||
      ev.startDate ||
      ev.start_date ||
      ev.datetime ||
      ev.dateTime ||
      ev.createdAt ||
      ev.created_at ||
      ev.created ||
      null;

    const normalizeDate = (raw, ev) => {
      // fallback to common fields if raw is falsy
      if (!raw) {
        raw =
          ev.eventDate ||
          ev.event_date ||
          ev.date ||
          ev.startDate ||
          ev.start_date ||
          ev.createdAt ||
          ev.created_at ||
          ev.created ||
          null;
      }
      if (!raw) return null;

      const time = ev.eventTime || ev.time || ev.timeOfDay || null;
      const rawStr = String(raw);

      // plain date YYYY-MM-DD -> local midnight for that day
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawStr)) {
        if (time) {
          const combined = `${rawStr}T${time}`;
          const d = new Date(combined);
          if (isNaN(d)) return null;
          return d;
        }
        const [y, m, d] = rawStr.split("-").map(Number);
        return new Date(y, m - 1, d);
      }

      // ISO at midnight UTC -> treat as date-only
      if (/^\d{4}-\d{2}-\d{2}T00:00:00(?:\.000)?Z?$/.test(rawStr)) {
        const datePart = rawStr.split("T")[0];
        const [y, m, d] = datePart.split("-").map(Number);
        return new Date(y, m - 1, d);
      }

      // fallback to normal datetime parsing
      const d = new Date(rawStr);
      if (isNaN(d)) return null;
      return d;
    };

    items.forEach((ev) => {
      const raw = pickDateField(ev);
      const d = normalizeDate(raw, ev);
      const key = d ? d.toDateString() : String(raw || ev._id || ev.id || "");
      map[key] = map[key] || [];
      map[key].push({
        id: ev._id || ev.id,
        time: ev.eventTime || ev.time || "",
        title: ev.eventTitle || ev.title || "(no title)",
        type: ev.eventType || ev.type || "",
        color: ev.eventColor || ev.color || "blue",
        createdAt: ev.createdAt || ev.created_at || ev.created || null,
        _raw: ev,
      });
    });

    setFetchedMap(map);
  }, [fetchedData]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-32">
        <LoadingComp />;
      </div>
    );
  }
  return (
    <div>
      {/* 7-Day Calendar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-2">
        <button
          className="btn btn-sm bg-base-200 hover:bg-base-300 rounded-lg"
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
                className={`btn btn-sm text-xs py-2 transition-all duration-200 rounded-lg flex flex-col md:flex-row items-center gap-1 btn-outline border border-black ${
                  isSelected ? "bg-primary" : "bg-base-200 hover:bg-base-300"
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
          className="btn btn-sm bg-base-200 hover:bg-base-300 rounded-lg"
          onClick={() => changeWeek(1)}
        >
          &gt;
        </button>
      </div>
      <div className="flex justify-end m-2">
        <button
          className="btn bg-base-200 hover:bg-base-300 rounded-2xl"
          onClick={() => onAddEvent(selectedDay)}
        >
          <Plus size={16} className="inline mr-2" />
          Add Event
        </button>
      </div>
      {/* Events for selected day */}
      <div className="bg-base-200 rounded-lg p-4 shadow-sm">
        <h4 className="text-sm font-semibold mb-2">
          Events on {selectedDay.toLocaleDateString()}
        </h4>
        {(fetchedMap[selectedDay.toDateString()] || []).length === 0 ? (
          <div className="text-sm text-gray-500">No events for this day.</div>
        ) : (
          // <ul className="space-y-2">
          //   {(fetchedMap[selectedDay.toDateString()] || []).map((ev) => (
          //     <li
          //       key={ev.id}
          //       className="flex items-start space-x-3 cursor-pointer"
          //       onClick={(e) => {
          //         e.stopPropagation();
          //         setSelectedEvent(ev);
          //         setShowViewEventModal(true);
          //       }}
          //     >
          //       <div className="text-xs text-gray-500 w-20">{ev.time}</div>
          //       <div className="flex-1">
          //         <div className="font-medium">{ev.title}</div>
          //         <div className="text-xs text-gray-500">{ev.type}</div>
          //       </div>
          //     </li>
          //   ))}
          // </ul>
          <ul className="timeline timeline-vertical">
            {(fetchedMap[selectedDay.toDateString()] || []).map((ev) => (
              <li
                key={ev.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(ev);
                  setShowViewEventModal(true);
                }}
                className="cursor-pointer"
              >
                <div className="timeline-start flex gap-1 items-center">
                  <Clock className="h-4" />
                  <div className="">{ev.time}</div>
                </div>
                <div className="timeline-middle">
                  {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg> */}
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox checkbox-primary"
                  />
                </div>
                <div className="timeline-end timeline-box font-bold">
                  {ev.type}
                </div>
                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* View Event Modal (linear) */}
      {showViewEventModal && selectedEvent && (
        <EventModal
          selectedEvent={selectedEvent}
          onClose={() => {
            setShowViewEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default LinearCalendar;
