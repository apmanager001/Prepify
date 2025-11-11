"use client";
import React, { useMemo, useState } from "react";
import { Plus, Trash, ArrowLeft } from "lucide-react";

// Max notes allowed (easy to change)
const MAX_NOTES = 10;

const PLACEHOLDER_NOTES = [
  {
    id: "1",
    title: "Welcome",
    body: "This is your personal notes area. Tap a note to view details.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Study Plan",
    body: "- Finish math exercises\n- Read chapter 4 of physics",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "3",
    title: "Ideas",
    body: "Startup idea: lightweight flashcards app with spaced repetition.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "4",
    title: "Welcome",
    body: "This is your personal notes area. Tap a note to view details.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Study Plan",
    body: "- Finish math exercises\n- Read chapter 4 of physics",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "6",
    title: "Ideas",
    body: "Startup idea: lightweight flashcards app with spaced repetition.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "7",
    title: "Welcome",
    body: "This is your personal notes area. Tap a note to view details.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Study Plan",
    body: "- Finish math exercises\n- Read chapter 4 of physics",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "9",
    title: "Ideas",
    body: "Startup idea: lightweight flashcards app with spaced repetition.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "10",
    title: "Welcome",
    body: "This is your personal notes area. Tap a note to view details.",
    createdAt: new Date().toISOString(),
  },
];

export default function Notes() {
  const [notes, setNotes] = useState(PLACEHOLDER_NOTES);
  const [selectedId, setSelectedId] = useState(notes[0]?.id ?? null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showDetailsOnMobile, setShowDetailsOnMobile] = useState(false);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId]
  );

  const canAdd = notes.length < MAX_NOTES;

  function addNote(e) {
    e.preventDefault();
    if (!canAdd) return;
    const newNote = {
      id: String(Date.now()),
      title: title.trim() || `Note ${notes.length + 1}`,
      body: body.trim() || "",
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setTitle("");
    setBody("");
    setSelectedId(newNote.id);
    setShowDetailsOnMobile(true);
  }

  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) {
      setSelectedId((prev) => {
        const remaining = notes.filter((n) => n.id !== id);
        return remaining[0]?.id ?? null;
      });
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Notes</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: note creation + list */}
        <div className="md:col-span-1">
          <form onSubmit={addNote} className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <input
                className="input input-bordered flex-1"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
              <button
                type="submit"
                disabled={!canAdd}
                className={`btn btn-primary rounded-xl ${
                  !canAdd ? "btn-disabled" : ""
                }`}
                aria-disabled={!canAdd}
              >
                <Plus size={16} />
              </button>
            </div>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Write your note..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                {notes.length}/{MAX_NOTES} used
              </div>
              {!canAdd && (
                <div className="text-red-500">Note limit reached</div>
              )}
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-sm w-full">
            <ul className="divide-y w-full">
              {notes.map((n) => (
                <li
                  key={n.id}
                  className={`p-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 w-full ${
                    n.id === selectedId ? "bg-primary/5" : ""
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedId(n.id);
                      setShowDetailsOnMobile(true);
                    }}
                    className="flex-1 min-w-0"
                  >
                    <div className="font-medium truncate">{n.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {n.body}
                    </div>
                  </div>

                  <div className="ml-3 flex-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(n.id);
                      }}
                      aria-label={`Delete ${n.title}`}
                      className="btn btn-ghost rounded btn-sm"
                    >
                      <Trash size={14} className="text-error"/>
                    </button>
                  </div>
                </li>
              ))}
              {notes.length === 0 && (
                <li className="p-4 text-sm text-gray-500">
                  No notes yet — add your first note above.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Right: detail view — on mobile this becomes a panel that can be toggled */}
        <div
          className={`md:col-span-2 bg-white rounded-lg shadow p-4 ${
            showDetailsOnMobile ? "" : "hidden md:block"
          }`}
        >
          <div className="md:hidden mb-4">
            <button
              className="btn btn-ghost"
              onClick={() => setShowDetailsOnMobile(false)}
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
          {selectedNote ? (
            <article>
              <h3 className="text-xl font-semibold mb-2">
                {selectedNote.title}
              </h3>
              <div className="text-xs text-gray-500 mb-4">
                {new Date(selectedNote.createdAt).toLocaleString()}
              </div>
              <div className="whitespace-pre-wrap text-gray-800">
                {selectedNote.body}
              </div>
            </article>
          ) : (
            <div className="text-center text-gray-500">
              Select a note to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
