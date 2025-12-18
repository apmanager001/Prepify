"use client";
import {
  Hammer,
  MessageCircleQuestionMark,
  Music,
  Timer,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitContactMessage } from "@/lib/api";
import CurrentPlayer from "../comp/dashboardComps/currentPlayer";
import ToolTimers from "./toolTimers";
import toast from "react-hot-toast";

const CornerWidgets = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolClick = (tool) => {
    setSelectedTool(tool === selectedTool ? null : tool);
  };
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4 z-50">
      <div className=" md:fixed bottom-6 md:right-20 flex flex-col justify-center items-center gap-4 z-50">
        {selectedTool === "feedback" && (
          <Feedback
            isOpen={selectedTool === "feedback"}
            onClose={() => setSelectedTool(null)}
          />
        )}
        {selectedTool === "music" && (
          <div className="fade-in">
            <CurrentPlayer />
          </div>
        )}
        {selectedTool === "timers" && (
          <div className="fade-in">
            <ToolTimers />
          </div>
        )}
      </div>
      <div className="fab cursor-pointer" data-tip="Quick Tools">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-lg btn-circle btn-primary cursor-pointer"
          data-tip="Quick Tools"
        >
          <Hammer />
        </div>

        <button
          className="btn btn-lg btn-circle bg-success/40 tooltip tooltip-left"
          data-tip="Feedback"
          onClick={() => handleToolClick("feedback")}
        >
          {selectedTool === "feedback" ? (
            <X onClick={() => setSelectedTool(null)} />
          ) : (
            <MessageCircleQuestionMark />
          )}
        </button>
        <button
          className="btn btn-lg btn-circle bg-info/40 tooltip tooltip-left"
          data-tip="Music"
          onClick={() => handleToolClick("music")}
        >
          {selectedTool === "music" ? (
            <X onClick={() => setSelectedTool(null)} />
          ) : (
            <Music />
          )}
        </button>
        <button
          className="btn btn-lg btn-circle bg-warning/40 tooltip tooltip-left"
          data-tip="Timers"
          onClick={() => handleToolClick("timers")}
        >
          {selectedTool === "timers" ? (
            <X onClick={() => setSelectedTool(null)} />
          ) : (
            <Timer />
          )}
        </button>
      </div>
    </div>
  );
};

export default CornerWidgets;

const Feedback = ({ isOpen, onClose }) => {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = React.useState(false);

  const mutation = useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => {
      setSuccess(true);
      toast.success("Thank you, feedback sent!");
      setForm({ name: "", email: "", message: "" });
      // auto-close after a short delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1600);
    },
    onError: () => {
      // keep form open so user can retry; could show an error message
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 sm:w-96 bg-white rounded-xl shadow-2xl p-4 border border-gray-100 fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold">Send Feedback</h4>
        <div className="gap-2">
          <button
            onClick={onClose}
            aria-label="Close feedback"
            className="btn btn-ghost rounded-full"
          >
            ✕
          </button>
        </div>
      </div>

      {success ? (
        <div className="text-sm text-green-600">Thanks — feedback sent!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full input "
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email"
            className="w-full input"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="We look forward to hearing from you!"
            className="w-full textarea resize-none"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.status === "pending"}
              className="btn btn-primary btn-sm disabled:opacity-60"
            >
              {mutation.status === "pending" ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
