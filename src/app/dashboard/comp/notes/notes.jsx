"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Plus, Trash, ArrowLeft, Edit, Clock, Pencil } from "lucide-react";
import {
  useNotes,
  useCreateNote,
  useDeleteNote,
  useUpdateNote,
} from "./lib/notesApi";
import toast from "react-hot-toast";
// Max notes allowed (easy to change)
const MAX_NOTES = 10;

export default function Notes() {
  const {
    data: notesData,
    isLoading,
    isError,
  } = useNotes({
    // return server shape directly; assume server returns an array
    select: (v) => (Array.isArray(v) ? v : v.notes ?? []),
  });

  const notes = notesData ?? [];
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showDetailsOnMobile, setShowDetailsOnMobile] = useState(false);

  const selectedNote = useMemo(
    () => notes.find((n) => n._id === selectedId) ?? null,
    [notes, selectedId]
  );

  // set initial selected when notes load
  useEffect(() => {
    if (!selectedId && notes && notes.length) {
      setSelectedId(notes[0]._id);
    }
  }, [notes]);

  // Ensure mutation hooks are called on every render (fixes hooks order issues)
  const createMutation = useCreateNote();
  const deleteMutation = useDeleteNote();
  const updateMutation = useUpdateNote();
  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteIdState, setDeleteIdState] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  // show loading state while notes are being fetched
  if (isLoading) {
    return (
      <div className="p-4 min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <div className="mt-2 text-gray-500">Loading notes…</div>
        </div>
      </div>
    );
  }

  // Enable Add only when user has typed a title or body AND we are below the max notes limit
  const isAddEnabled =
    (title.trim() !== "" || body.trim() !== "") && notes.length < MAX_NOTES;

  async function addNote(e) {
    e.preventDefault();
    if (!isAddEnabled) return;
    try {
      const payload = {
        title: title.trim() || `Note ${notes.length + 1}`,
        body: body.trim() || "",
      };
      const created = await createMutation.mutateAsync(payload);
      setTitle("");
      setBody("");
      setShowDetailsOnMobile(true);
      // if server returned the created note, select it
      const id = created?._id || created?.note?._id;
      if (id) setSelectedId(id);
    } catch (err) {
      console.error("create note failed", err);
      // optionally toast error
    }
  }

  async function deleteNote(id) {
    try {
      await deleteMutation.mutateAsync(id);
      if (selectedId === id) {
        setSelectedId((prev) => {
          const remaining = notes.filter((n) => n._id !== id);
          return remaining[0]?._id ?? null;
        });
      }
      // show success toast after deletion
      toast.success("Note deleted");
    } catch (err) {
      console.error("delete note failed", err);
      throw err;
    }
  }

  // handlers for edit modal
  const closeEdit = () => {
    setIsEditOpen(false);
    setEditId(null);
    setEditTitle("");
    setEditBody("");
  };

  const saveEdit = async () => {
    if (!editId) return;
    try {
      await updateMutation.mutateAsync({
        id: editId,
        payload: { title: editTitle, body: editBody },
      });
      // keep the edited note selected
      setSelectedId(editId);
      closeEdit();
      setShowDetailsOnMobile(true);
      toast.success("Note updated");
    } catch (err) {
      console.error("update note failed", err);
    }
  };
  // Delete modal helpers (in-scope of Notes component)
  function openDeleteModal(id, title) {
    setDeleteIdState(id);
    setDeleteTitle(title ?? "");
    setIsDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!deleteIdState) return;
    try {
      await deleteNote(deleteIdState);
      setIsDeleteOpen(false);
      setDeleteIdState(null);
      setDeleteTitle("");
    } catch (err) {
      console.error("confirm delete failed", err);
    }
  }
  return (
    <div className="p-4 min-h-dvh">
      <h2 className="text-2xl font-semibold mb-4">Notes</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Left: note creation + list */}
        <div className="md:col-span-1">
          <form onSubmit={addNote} className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <input
                id="title"
                type="text"
                className="input input-bordered flex-1 bg-base-200"
                placeholder="Title*"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
              <button
                type="submit"
                disabled={!isAddEnabled}
                className={`btn btn-base-200 rounded-xl ${
                  !isAddEnabled ? "btn-disabled" : ""
                }`}
                aria-disabled={!isAddEnabled}
              >
                <Plus size={16} />
              </button>
            </div>
            <textarea
              id="body"
              type="text"
              className="textarea textarea-bordered w-full bg-base-200"
              placeholder="Write your note..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                {notes.length}/{MAX_NOTES} used
              </div>
              {notes.length >= MAX_NOTES && (
                <div className="text-red-500">Note limit reached</div>
              )}
            </div>
          </form>

          <div className="bg-base-200 rounded-lg shadow-sm w-full ">
            <ul className="divide-y w-full">
              {notes.map((n) => (
                <li
                  key={n._id}
                  className={`p-3 cursor-pointer flex justify-between items-center hover:bg-base-300 w-full ${
                    n._id === selectedId ? "bg-primary/5" : ""
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedId(n._id);
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
                        openDeleteModal(n._id, n.title);
                      }}
                      aria-label={`Delete ${n.title}`}
                      className="btn btn-ghost rounded btn-sm"
                    >
                      <Trash size={14} className="text-error" />
                    </button>
                  </div>
                </li>
              ))}
              {notes.length === 0 && (
                <li className="p-4 text-sm text-gray-500 ">
                  No notes yet — add your first note above.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Right: detail view — on mobile this becomes a panel that can be toggled */}
        <div
          className={`md:col-span-2 bg-base-200 rounded-lg shadow p-4 ${
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
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">
                    {selectedNote.title}
                  </h3>
                  <div
                    className="text-xs text-gray-500 mb-1 flex items-center gap-2 tooltip cursor-default"
                    data-tip={"Note created on date"}
                  >
                    <span>
                      <Clock size={14} />
                    </span>
                    <span>
                      {selectedNote?.createdAt
                        ? new Date(selectedNote.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  {selectedNote?.updatedAt && (
                    <div
                      className="text-xs text-gray-500 flex items-center gap-2 tooltip cursor-default"
                      data-tip={"Note last updated on date"}
                    >
                      <span>
                        <Pencil size={14} />
                      </span>
                      <span>
                        {new Date(selectedNote.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="btn btn-sm bg-base-200 hover:bg-base-300 rounded"
                    onClick={() => {
                      // open modal and prefill fields
                      setEditId(selectedNote._id);
                      setEditTitle(selectedNote.title ?? "");
                      setEditBody(selectedNote.body ?? selectedNote.text ?? "");
                      setIsEditOpen(true);
                    }}
                  >
                    <Edit size={16} /> Edit
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-gray-800 mt-4">
                {selectedNote.body ?? selectedNote.text}
              </div>
            </article>
          ) : (
            <div className="text-center text-gray-500">
              Select a note to view details
            </div>
          )}
        </div>
      </div>

      <EditModal
        open={isEditOpen}
        title={editTitle}
        body={editBody}
        onChangeTitle={setEditTitle}
        onChangeBody={setEditBody}
        onClose={closeEdit}
        onSave={saveEdit}
        saving={updateMutation.isLoading}
      />
      <DeleteModal
        open={isDeleteOpen}
        title={deleteTitle}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        confirming={deleteMutation.isLoading}
      />
    </div>
  );
}

// Edit Modal (rendered conditionally) — keeps single-file scope for now
function EditModal({
  open,
  title,
  body,
  onChangeTitle,
  onChangeBody,
  onClose,
  onSave,
  saving,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-base-200 rounded-lg w-full max-w-2xl p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Edit Note</h3>
        <div className="space-y-2">
          <input
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="Title"
            maxLength={120}
          />
          <textarea
            className="textarea textarea-bordered w-full"
            value={body}
            onChange={(e) => onChangeBody(e.target.value)}
            rows={8}
            placeholder="Body"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className={`btn btn-primary ${saving ? "loading" : ""}`}
            onClick={onSave}
            type="button"
            disabled={saving}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete confirmation modal
function DeleteModal({ open, title, onClose, onConfirm, confirming }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-base-100 rounded-lg w-full max-w-md p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Delete Note</h3>
        <div className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete <strong>{title}</strong>? This action
          cannot be undone.
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className={`btn btn-error ${confirming ? "loading" : ""}`}
            onClick={onConfirm}
            type="button"
            disabled={confirming}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
