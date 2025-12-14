import React from "react";
import ToolsFooter from "./toolsFooter";
import { useCalendarEvents } from "../calendar/lib/calendar";
import { useNotes } from "../notes/lib/notesApi";
import { useTodos } from "../todo/lib/todoAPI";
import LoadingComp from "@/lib/loading";

const todaysDate = new Date().toLocaleDateString("en-US");

const today = new Date().toISOString().split("T")[0];
const startToday = today;
const endToday = today;

const Overview = () => {
  const { data: fetchEventData, isLoading: calendarLoading } =
    useCalendarEvents({
      from: startToday,
      to: endToday,
    });
  const { data: notes, isLoading: notesLoading } = useNotes();
  const { data: todos, isLoading: todosLoading } = useTodos();

  // normalize notes to an array regardless of shape
  const notesList = Array.isArray(notes)
    ? notes
    : notes?.notes || notes?.data || [];

  // normalize todos to an array regardless of shape
  const todosList = Array.isArray(todos)
    ? todos
    : todos?.data || todos?.items || todos?.todos || [];

  return (
    <div className="flex flex-col gap-4 mb-24 xl:mb-10">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-base-200 rounded-md shadow-sm">
        <div className="flex-1 flex items-center justify-between md:justify-start gap-4 w-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
              Dashboard
            </h1>
            <div className="text-sm text-gray-500">Quick Tools & Stats</div>
          </div>
        </div>
      </header>
      <div className="flex flex-col md:flex-row md:flex-wrap md:-mx-2 md:px-4 w-full">
        {/* Calendar card - render raw event objects */}
        <div className="md:w-1/2 px-2 mb-4">
          <div className="bg-base-200 rounded-md overflow-hidden border border-gray-200 shadow-sm">
            <div className="bg-info/30 px-4 py-2 text-sm font-medium text-info-content">{`Today's Calendar Events ${todaysDate}`}</div>
            <div className="p-4 min-h-[18rem]">
              {calendarLoading ? (
                <div className="text-sm text-gray-500 w-full">
                  <LoadingComp />
                </div>
              ) : !fetchEventData ||
                !Array.isArray(fetchEventData?.events) ||
                fetchEventData.events.length === 0 ? (
                <div className="text-sm text-gray-500">No events for today</div>
              ) : (
                <div className="space-y-3">
                  {fetchEventData?.events.map((ev) => (
                    <div
                      key={ev._id}
                      className="p-3 border border-base-200 rounded-md bg-info/10"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            {ev.eventTitle}
                          </div>
                          <div className="text-xs text-base-content">
                            {ev.eventDescription}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {ev.eventTime ||
                            (ev.eventDate
                              ? new Date(ev.eventDate).toLocaleTimeString()
                              : "")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes card - render recent notes objects */}
        <div className="md:w-1/2 px-2 mb-4">
          <div className="bg-base-200 rounded-md overflow-hidden border border-gray-200 shadow-sm">
            <div className="bg-info/30 px-4 py-2 text-sm font-medium text-info-content">
              Notes
            </div>
            <div className="p-4 min-h-[18rem]">
              {notesLoading ? (
                <div className="text-sm text-gray-500 w-full">
                  <LoadingComp />
                </div>
              ) : !notesList || notesList.length === 0 ? (
                <div className="text-sm text-gray-500">No notes</div>
              ) : (
                <div className="space-y-3">
                  {notesList.slice(0, 6).map((n, i) => (
                    <div
                      key={n._id || i}
                      className="p-3 border border-base-300 rounded-md bg-warning/10"
                    >
                      <div className="text-sm font-semibold text-gray-800">
                        {n.title || n.noteTitle}
                      </div>
                      {n.body && (
                        <div className="text-sm text-gray-800 truncate">
                          {n.body}
                        </div>
                      )}
                      {n.createdAt && (
                        <div className="text-xs text-gray-500">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Todos card - render todo objects */}
        <div className="md:w-1/2 px-2 mb-14">
          <div className="bg-base-200 rounded-md overflow-hidden border border-base-200 shadow-sm">
            <div className="bg-info/30 px-4 py-2 text-sm font-medium text-info-content">
              To Do
            </div>
            <div className="p-4 min-h-[18rem]">
              {todosLoading ? (
                <div className="text-sm text-gray-500 w-full">
                  <LoadingComp />
                </div>
              ) : !todosList || todosList.length === 0 ? (
                <div className="text-sm text-gray-500">No tasks</div>
              ) : (
                <div className="space-y-3">
                  {todosList.slice(0, 6).map((t, i) => (
                    <div
                      key={t._id || t.id || i}
                      className="p-3 border border-gray-200 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-success mt-1 sm:mt-0 cursor-default"
                          checked={!!t.completed}
                          readOnly
                          aria-label={`Todo ${
                            t.title || t.task || t.text
                          } completed`}
                        />
                        <div className="text-sm text-gray-800">
                          {t.title || t.task || t.text}
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0 flex items-center gap-3">
                        {t.createdAt && (
                          <div className="text-xs text-gray-500">
                            {new Date(t.createdAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
