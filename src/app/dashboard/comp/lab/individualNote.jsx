"use client";
import React, { useEffect, useState } from "react";
import {
  Edit,
  Clock,
  Pencil,
  Trash,
  Expand,
  NotebookText,
  Ellipsis,
} from "lucide-react";

const formatShortDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const IndividualNote = ({
  selectedNote,
  onSaveEdit,
  saving,
  onDeleteNote,
  deleting,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    if (!selectedNote || !isEditOpen) return;
    setEditTitle(selectedNote.title ?? "");
    setEditBody(selectedNote.body ?? selectedNote.text ?? "");
  }, [selectedNote, isEditOpen]);

  const openEdit = () => {
    if (!selectedNote) return;
    setEditTitle(selectedNote.title ?? "");
    setEditBody(selectedNote.body ?? selectedNote.text ?? "");
    setIsActionsOpen(false);
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!selectedNote?._id) return;
    await onSaveEdit?.(selectedNote._id, {
      title: editTitle,
      body: editBody,
    });
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedNote?._id) return;
    await onDeleteNote?.(selectedNote._id);
    setIsDeleteOpen(false);
  };

  useEffect(() => {
    setIsActionsOpen(false);
  }, [selectedNote?._id]);

  return (
    <div
      className={`md:col-span-2 bg-base-100 rounded-lg shadow p-2 h-full border border-base-content/20`}
    >
      {selectedNote ? (
        <article>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="bg-base-100 rounded-lg text-neutral p-2 text-sm font-medium flex items-center gap-2">
                <div className="flex items-center text-neutral-content text-lg border-3 border-primary bg-neutral p-2 rounded-xl hover:scale-105">
                  <NotebookText />
                </div>
                <span className="text-xl font-semibold mb-2">
                  {selectedNote.title}
                </span>
              </div>
              <div
                className="text-xs text-gray-500 mb-1 flex items-center gap-2 tooltip cursor-default max-w-24"
                data-tip={"Note created on date"}
              >
                <span>
                  <Clock size={14} />
                </span>
                <span>{formatShortDate(selectedNote?.createdAt)}</span>
              </div>
              {selectedNote?.updatedAt && (
                <div
                  className="text-xs text-gray-500 flex items-center gap-2 tooltip cursor-default max-w-24"
                  data-tip={"Note last updated on date"}
                >
                  <span>
                    <Pencil size={14} />
                  </span>
                  <span>{formatShortDate(selectedNote.updatedAt)}</span>
                </div>
              )}
            </div>
            <div className="relative mt-4 self-start">
              <button
                type="button"
                className="btn btn-sm btn-ghost btn-circle"
                aria-label="Open note actions"
                aria-expanded={isActionsOpen}
                onClick={() => setIsActionsOpen((prev) => !prev)}
              >
                <Ellipsis size={18} />
              </button>
              {isActionsOpen && (
                <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-box border border-base-content/10 bg-base-100 p-2 shadow-lg">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost justify-start"
                    onClick={() => {
                      setIsPreviewOpen(true);
                      setIsActionsOpen(false);
                    }}
                  >
                    <Expand size={16} /> Expand
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost justify-start"
                    onClick={openEdit}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost justify-start text-error hover:bg-error/10"
                    onClick={() => {
                      setIsDeleteOpen(true);
                      setIsActionsOpen(false);
                    }}
                  >
                    <Trash size={16} /> Delete
                  </button>
                </div>
              )}
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

      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="bg-base-200 rounded-lg w-full max-w-2xl p-4 shadow-lg border border-base-content/20 min-h-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-base-200 rounded-lg text-neutral p-2 text-sm font-medium flex items-center gap-2">
              <div className="flex items-center text-neutral-content text-lg border-3 border-primary bg-neutral p-2 rounded-xl hover:scale-105">
                <Trash />
              </div>
              <span className="text-xl font-semibold mb-2">Edit Note</span>
            </div>
            <div className="space-y-2">
              <input
                className="input input-ghost bg-base-100 w-full"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                maxLength={120}
              />
              <textarea
                className="textarea textarea-ghost bg-base-100 w-full"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={8}
                placeholder="Body"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="btn"
                onClick={() => setIsEditOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`btn btn-primary ${saving ? "loading" : ""}`}
                onClick={handleSave}
                type="button"
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsDeleteOpen(false)}
        >
          <div
            className="bg-base-100 rounded-lg w-full max-w-md p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-base-100 rounded-lg text-neutral p-2 text-sm font-medium flex items-center gap-2">
              <div className="flex items-center text-neutral-content text-lg border-3 border-primary bg-neutral p-2 rounded-xl hover:scale-105">
                <Trash />
              </div>
              <span className="text-xl font-semibold mb-2">Delete Note</span>
            </div>
            <div className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete{" "}
              <strong>{selectedNote?.title}</strong>? This action cannot be
              undone.
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="btn"
                onClick={() => setIsDeleteOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`btn btn-error ${deleting ? "loading" : ""}`}
                onClick={handleDelete}
                type="button"
                disabled={deleting}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isPreviewOpen && selectedNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="bg-base-100 rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto p-6 shadow-xl border border-base-content/20 min-h-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">{selectedNote.title}</h3>
                <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{formatShortDate(selectedNote.createdAt)}</span>
                  </div>
                  {selectedNote.updatedAt && (
                    <div className="flex items-center gap-1">
                      <Pencil size={14} />
                      <span>{formatShortDate(selectedNote.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="whitespace-pre-wrap text-gray-800 mt-6 text-base leading-7">
              {selectedNote.body ?? selectedNote.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualNote;
