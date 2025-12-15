import React, { useState } from "react";
import { X, Calendar, Clock, Tag, FileText, Trash2 } from "lucide-react";
import { useDeleteCalendarEvent } from "./lib/calendar";
import toast from "react-hot-toast";

const EventModal = ({ selectedEvent, onClose }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const deleteMutation = useDeleteCalendarEvent();
  function DeleteButtonLinear({ selectedEvent, onClose }) {
    return (
      <button
        onClick={() => setShowConfirmDelete(true)}
        className={`btn btn-error btn-soft rounded-3xl text-error hover:text-white ${
          deleteMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={deleteMutation.isLoading}
      >
        <Trash2 size={18} />
      </button>
    );
  }
  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box max-w-lg bg-neutral text-neutral-content border border-base-border shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <Calendar size={20} />
                {selectedEvent.title || "Event"}
              </h3>
              <p className="text-sm text-neutral-content/60 mt-1">
                Created:{" "}
                {(() => {
                  const raw =
                    selectedEvent?.createdAt ||
                    selectedEvent?._raw?.createdAt ||
                    selectedEvent?._raw?.created_at ||
                    selectedEvent?._raw?.created ||
                    null;
                  if (!raw) return "—";
                  try {
                    return new Date(raw).toLocaleDateString();
                  } catch (e) {
                    return String(raw);
                  }
                })()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-primary" />
              <div>
                <div className="text-xs font-medium text-neutral-content/70 uppercase tracking-wide">
                  Time
                </div>
                <div className="text-sm font-semibold">
                  {selectedEvent.time || "—"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tag size={16} className="text-secondary" />
              <div>
                <div className="text-xs font-medium text-neutral-content/70 uppercase tracking-wide">
                  Type
                </div>
                <div className="badge badge-primary badge-outline">
                  {selectedEvent.type || "—"}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <FileText size={16} className="text-accent mt-1" />
              <div className="flex-1">
                <div className="text-xs font-medium text-neutral-content/70 uppercase tracking-wide">
                  Description
                </div>
                <div className="text-sm whitespace-pre-wrap p-3 rounded-lg max-h-32 overflow-y-auto">
                  {selectedEvent.description || "No description"}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <DeleteButtonLinear
              selectedEvent={selectedEvent}
              onClose={onClose}
            />
          </div>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={async () => {
                  try {
                    await deleteMutation.mutateAsync(selectedEvent.id);
                    toast.success("Event deleted");
                    onClose();
                  } catch (err) {
                    toast.error("Failed to delete event");
                  }
                  setShowConfirmDelete(false);
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventModal;
