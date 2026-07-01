"use client";
import React, { useEffect, useState } from "react";
import { NotebookPen } from "lucide-react";

const AddNoteModal = ({ open, onClose, onSave, saving }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!open) {
      setTitle("");
      setBody("");
    }
  }, [open]);

  if (!open) return null;

  const canSave = title.trim() !== "" || body.trim() !== "";

  const handleSave = async () => {
    if (!canSave) return;
    await onSave?.({ title, body });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-base-200 rounded-lg w-full max-w-2xl p-4 shadow-lg border border-base-content/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-neutral-content text-neutral px-2 py-2 text-sm font-medium flex items-center gap-2">
          <div className="flex items-center text-neutral-content text-lg border-3 border-primary bg-neutral p-2 rounded-xl hover:scale-105">
            <NotebookPen />
          </div>
          Add Note
        </div>
        <div className="space-y-2">
          <input
            className="input input-ghost bg-base-100 w-full"
            id='add-note-title-input'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            maxLength={120}
          />
          <textarea
            className="textarea textarea-ghost bg-base-100 w-full"
            id='add-note-body-textarea'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Notes"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose} type="button" id='add-note-cancel-button'>
            Cancel
          </button>
          <button
            className={`btn btn-primary ${saving ? "loading" : ""}`}
            id='add-note-save-button'
            onClick={handleSave}
            type="button"
            disabled={saving || !canSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
