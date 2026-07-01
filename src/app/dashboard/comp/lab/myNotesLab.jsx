"use client";
import React, { useMemo, useState } from "react";
import { Plus, Search, NotebookText } from "lucide-react";

const MAX_NOTES = 10;

const formatCreatedAt = (createdAt) => {
  if (!createdAt) return "";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDiff = Math.floor((today - targetDay) / 86400000);

  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const MyNotesLab = ({
  notes = [],
  selectedId,
  onSelectNote,
  onOpenAddNote,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredNotes = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return notes;

    return notes.filter((n) => {
      const title = (n.title ?? "").toLowerCase();
      const body = (n.body ?? n.text ?? "").toLowerCase();
      return title.includes(q) || body.includes(q);
    });
  }, [notes, searchText]);

  return (
    <div className="bg-base-100 rounded-lg shadow-sm w-full border border-base-content/20 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-center p-2 border-b border-base-content/20">
        <div className="bg-base-100 rounded-lg text-neutral px-2 py-2 text-sm font-medium flex items-center gap-2">
          <div className="flex items-center text-neutral-content text-lg border-3 border-primary bg-neutral p-2 rounded-xl hover:scale-105">
            <NotebookText />
          </div>
          Notes
        </div>
        <div className="flex flex-col xl:flex-row items-center gap-2">
          <label className="input max-w-40">
            <Search size={16} className="text-neutral" />
            <input
              type="search"
              id="my-notes-search"
              className="grow text-neutral"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </label>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              {notes.length}/{MAX_NOTES}
            </div>
            {notes.length >= MAX_NOTES && (
              <div className="text-red-500">Note limit reached</div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable notes list */}
      <ul className="divide-y w-full flex-1 overflow-y-auto">
        {filteredNotes.map((n) => (
          <li
            key={n._id}
            className={`p-3 cursor-pointer flex justify-between items-center hover:bg-base-300/20 w-full ${
              n._id === selectedId ? "bg-primary/5" : ""
            }`}
          >
            <div
              onClick={() => onSelectNote?.(n._id)}
              className="flex-1 min-w-0"
            >
              <div className="font-medium truncate">{n.title}</div>
              <div className="text-xs text-gray-500 truncate">
                {n.body ?? n.text}
              </div>
            </div>

            <div className="ml-3 flex-none text-xs text-gray-500 whitespace-nowrap">
              {formatCreatedAt(n.createdAt)}
            </div>
          </li>
        ))}
        {filteredNotes.length === 0 && (
          <li className="p-4 text-sm text-gray-500">
            {notes.length === 0
              ? "No notes yet - add your first note below."
              : "No notes match your search."}
          </li>
        )}
      </ul>

      {/* Fixed bottom button */}
      <button
        type="button"
        onClick={onOpenAddNote}
        disabled={notes.length >= MAX_NOTES}
        className="flex w-full justify-center items-center p-4 border-t border-base-content/20 cursor-pointer hover:bg-base-300/20 text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={16} />
        <span>Add Note</span>
      </button>
    </div>
  );
};

export default MyNotesLab;
