"use client";
import React, { useState } from "react";
import { Plus, Trash } from "lucide-react";

const TODO_LIMIT = 20;

const DEFAULT_TODOS = [
  {
    id: String(Date.now() - 5000),
    text: "Review today's study plan",
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: String(Date.now() - 4000),
    text: "Finish math exercise set 3",
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: String(Date.now() - 3000),
    text: "Read chapter 4 of physics",
    completed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: String(Date.now() - 2000),
    text: "Prepare notes for group meeting",
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: String(Date.now() - 1000),
    text: "Practice flashcards (20m)",
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export default function Todo() {
  const [todos, setTodos] = useState(DEFAULT_TODOS);
  const [text, setText] = useState("");

  const addTodo = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    if (todos.length >= TODO_LIMIT) return;
    const newTodo = {
      id: String(Date.now()),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((s) => [newTodo, ...s]);
    setText("");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">To Do</h2>

      <form onSubmit={addTodo} className="space-y-3 mb-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input input-bordered flex-1"
            placeholder="Add a task"
            aria-label="New todo"
            maxLength={240}
          />
          <button
            type="submit"
            disabled={!text.trim() || todos.length >= TODO_LIMIT}
            className={`btn btn-primary rounded ${
              !text.trim() || todos.length >= TODO_LIMIT ? "btn-disabled" : ""
            }`}
            aria-disabled={!text.trim() || todos.length >= TODO_LIMIT}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            {todos.length}/{TODO_LIMIT} used
          </div>
          {todos.length >= TODO_LIMIT && (
            <div className="text-red-500">Task limit reached</div>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-sm w-full">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">{todos.length} items</div>
          <div className="text-sm text-gray-600">
            {completedCount} completed
          </div>
        </div>

        <ul className="divide-y">
          {todos.length === 0 && (
            <li className="p-4 text-sm text-gray-500">
              No tasks yet — add one above.
            </li>
          )}

          {todos.map((t) => (
            <li
              key={t.id}
              className={`p-3 flex items-center justify-between hover:bg-gray-50 ${
                t.completed ? "opacity-80" : ""
              }`}
            >
              <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTodo(t.id)}
                  className="checkbox checkbox-primary"
                  aria-label={`Mark ${t.text} complete`}
                />

                <div className="min-w-0">
                  <div
                    className={`font-medium truncate ${
                      t.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {t.text}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(t.createdAt).toLocaleString()}
                  </div>
                </div>
              </label>

              <div className="ml-3 flex-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(t.id);
                  }}
                  aria-label={`Delete ${t.text}`}
                  className="btn btn-ghost rounded btn-sm"
                >
                  <Trash size={14} className="text-error" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
