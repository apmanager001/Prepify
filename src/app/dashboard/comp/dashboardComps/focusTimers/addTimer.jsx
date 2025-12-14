"use client";
import React, { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useTimerStore } from "@/store/useTimerStore";
import toast from "react-hot-toast";

const AddTimerModal = ({ isOpen, onClose }) => {
  // Store action for creating a timer
  const createTimer = useTimerStore((s) => s.createTimer);

  // Local form state
  const [name, setName] = useState("");
  const [studyMinutes, setStudyMinutes] = useState(0);

  // Early return when modal is hidden
  if (!isOpen) return null;

  // Adjust minutes by predefined increments (min 0)
  const modifyMinutes = (delta) => {
    setStudyMinutes((prev) => Math.max(prev + delta, 0));
  };

  // Accept only valid numeric input for manual minutes
  const handleInputChange = (value) => {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n >= 0 && n <= 120) setStudyMinutes(n);
  };

  // Validate and submit timer creation form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Timer name cannot be empty");
      return;
    }

    if (studyMinutes <= 0) {
      toast.error("Minutes must be greater than 0");
      return;
    }

    await createTimer({ name, minutes: studyMinutes });

    toast.success("Timer created successfully!");

    // Reset form and close modal
    setName("");
    setStudyMinutes(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-base-100 rounded-xl shadow-lg p-8 w-106 space-y-6">
        {/* Modal header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Timer</h2>
          <button onClick={onClose} className="btn btn-circle btn-ghost">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Timer name field */}
          <div>
            <label htmlFor="timer-name" className="block text-sm font-medium mb-1">Timer Name</label>
            <input
              type="text"
              id='timer-name'
              className="input w-full rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              required
            />
          </div>

          {/* Minutes input section */}
          <div>
            <span className="block text-sm font-medium mb-1">
              Study Duration (Minutes)
            </span>

            {/* Quick-add buttons */}
            <div className="flex gap-2 flex-wrap mb-2 justify-around">
              {[1, 5, 10, 30].map((min) => (
                <button
                  key={`add-${min}`}
                  type="button"
                  className="btn btn-sm btn-outline flex items-center gap-1 hover:bg-base-200 border border-black rounded-sm"
                  onClick={() => modifyMinutes(min)}
                >
                  <Plus size={16} /> {min}
                </button>
              ))}
            </div>

            {/* Quick subtract buttons */}
            <div className="flex gap-2 flex-wrap mb-2 justify-around">
              {[1, 5, 15, 30].map((min) => (
                <button
                  key={`sub-${min}`}
                  type="button"
                  className="btn btn-sm btn-outline flex items-center gap-1 hover:bg-base-200 border border-black rounded-sm"
                  onClick={() => modifyMinutes(-min)}
                >
                  <Minus size={16} /> {min}
                </button>
              ))}
            </div>

            {/* Manual numeric input */}
            <div className="flex justify-center items-center gap-2 mt-2">
              <input
                type="number"
                className="w-24 px-2 py-1 border rounded-lg text-center bg-base-200"
                value={studyMinutes}
                min={0}
                max={Infinity}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <span className="text-sm ">minutes</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn rounded-lg hover:bg-base-300"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn text-success rounded-lg hover:bg-base-300"
            >
              Create Timer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTimerModal;
