"use client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { submitContactMessage } from "@/lib/api";
import { MessageCircleQuestionMark } from "lucide-react";
import toast from "react-hot-toast";

export default function FeedbackWidget() {
  const [open, setOpen] = React.useState(false);
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
        setOpen(false);
        setSuccess(false);
      }, 1600);
    },
    onError: () => {
      // keep form open so user can retry; could show an error message
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="fixed right-4 bottom-4 z-[80]">
      {/* <div className="fab"> */}
      {open ? (
        <div className="w-80 sm:w-96 bg-white rounded-xl shadow-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Send Feedback</h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close feedback"
                className="btn btn-ghost rounded-full"
              >
                ✕
              </button>
            </div>
          </div>

          {success ? (
            <div className="text-sm text-green-600">
              Thanks — feedback sent!
            </div>
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
                  onClick={() => setOpen(false)}
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
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open feedback"
          className="btn btn-info bg-info/10 rounded-full shadow-lg h-12 w-12 p-0 text-info"
        >
          <MessageCircleQuestionMark />
        </button>
      )}
    </div>
  );
}
