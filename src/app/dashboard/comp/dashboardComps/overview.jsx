import { Calendar, NotebookPen, SquareCheckBig } from "lucide-react";
import { Roboto } from "next/font/google";
import { useCalendarEvents } from "../calendar/lib/calendar";
import { useNotes } from "../notes/lib/notesApi";
import { useTodos } from "../todo/lib/todoAPI";
import LoadingComp from "@/lib/loading";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const todaysDate = new Date().toLocaleDateString("en-US");

const today = new Date().toISOString().split("T")[0];
const startToday = today;
const endToday = today;

const Overview = ({ changePage }) => {
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

  const fullCardClass =
    "customContainer overflow-hidden min-h-64 h-full flex flex-col";
  const cardHeaderClass =
    "bg-neutral-content text-neutral px-4 py-2 text-sm font-medium";
  const cardItemClass =
    "cursor-pointer p-2 bg-neutral-content text-primary border-2 border-neutral-content/60 rounded-md flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-3";
  const iconClass =
    "flex items-center text-neutral-content text-lg border-3 border-primary bg-neutral p-2 rounded-xl hover:scale-105";

  return (
    <div className="flex flex-col gap-4 mb-24 xl:mb-10">
      <header className="headerContainer">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-content uppercase tracking-wide">
            Overview
          </h1>
          <div className="text-sm text-neutral-content/80">
            Quick Tools & Stats
          </div>
        </div>
      </header>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 w-full gap-4 ${roboto.className}`}
      >
        {/* Calendar card - render raw event objects */}
        <div className="w-full">
          <div className={fullCardClass}>
            <div className={`${cardHeaderClass} flex items-center gap-2`}>
              <div className={`${iconClass}`}>
                <Calendar />
              </div>
              {`Today's Calendar Events ${todaysDate}`}
            </div>
            <div className="p-4 flex-1 min-h-32">
              {calendarLoading ? (
                <div className="text-sm text-neutral-content w-full">
                  <LoadingComp />
                </div>
              ) : !fetchEventData ||
                !Array.isArray(fetchEventData?.events) ||
                fetchEventData.events.length === 0 ? (
                <div className="text-sm text-neutral-content">
                  No events for today
                </div>
              ) : (
                <div className="space-y-3">
                  {fetchEventData?.events.map((ev) => (
                    <div
                      onClick={() => changePage("calendar")}
                      key={ev._id}
                      className={`${cardItemClass}`}
                    >
                      <div className="flex items-stretch justify-between w-full">
                        <div>
                          <div className="text-sm font-semibold text-neutral">
                            {ev.eventTitle}
                          </div>
                          {ev.eventDescription && (
                            <div className="text-xs text-neutral-content ml-2">
                              {ev.eventDescription}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-neutral-content/80">
                          {ev.eventTime ||
                            new Date(ev.eventDate).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
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
        <div className="w-full">
          <div className={fullCardClass}>
            <div className={`${cardHeaderClass} flex items-center gap-2`}>
              <div className={`${iconClass}`}>
                <NotebookPen />
              </div>
              Notes
            </div>
            <div className="p-4 flex-1 min-h-32">
              {notesLoading ? (
                <div className="text-sm text-neutral-content w-full">
                  <LoadingComp />
                </div>
              ) : !notesList || notesList.length === 0 ? (
                <div className="text-sm text-neutral-content">No notes</div>
              ) : (
                <div className="space-y-3">
                  {notesList.slice(0, 6).map((n, i) => (
                    <div
                      onClick={() => changePage("notes")}
                      key={n._id || i}
                      className={cardItemClass}
                    >
                      <div className="flex items-stretch justify-between w-full gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-neutral truncate">
                            {n.title || n.noteTitle}
                          </div>
                          {n.body && (
                            <div
                              className="text-xs text-neutral overflow-hidden"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {n.body}
                            </div>
                          )}
                        </div>

                        {n.createdAt && (
                          <div className="text-xs text-neutral/80 ml-4 whitespace-nowrap">
                            {new Date(n.createdAt).toLocaleDateString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                            })}
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

        {/* Todos card - render todo objects */}
        <div className="w-full mb-14">
          <div className={fullCardClass}>
            <div className={`${cardHeaderClass} flex items-center gap-2`}>
              <div className={`${iconClass}`}>
                <SquareCheckBig />
              </div>
              To Do
            </div>
            <div className="p-4 flex-1 min-h-32">
              {todosLoading ? (
                <div className="text-sm text-neutral-content w-full">
                  <LoadingComp />
                </div>
              ) : !todosList || todosList.length === 0 ? (
                <div className="text-sm text-neutral-content">No tasks</div>
              ) : (
                <div className="space-y-3">
                  {todosList.slice(0, 6).map((t, i) => (
                    <div
                      onClick={() => changePage("todo")}
                      key={t._id || t.id || i}
                      className={`${cardItemClass}`}
                    >
                      <div className="flex items-stretch gap-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-success mt-1 sm:mt-0 cursor-default"
                          checked={!!t.completed}
                          readOnly
                          aria-label={`Todo ${
                            t.title || t.task || t.text
                          } completed`}
                        />
                        <div className="text-sm text-neutral">
                          {t.title || t.task || t.text}
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0 flex items-center gap-3">
                        {t.createdAt && (
                          <div className="text-xs text-neutral/80">
                            {new Date(t.createdAt).toLocaleDateString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                            })}
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
