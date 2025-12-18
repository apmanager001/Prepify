"use client";
import React, { useState } from "react";
import { Plus, Trash } from "lucide-react";
import {
  useTodos,
  useCreateTodo,
  useToggleTodo,
  useDeleteTodo,
} from "./lib/todoAPI";

const TODO_LIMIT = 20;

export default function Todo() {
  // Query hooks (must be at top)
  const { data: todos = [], isLoading, isError } = useTodos();
  const createTodo = useCreateTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const [text, setText] = useState("");

  const addTodo = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    if (todos.length >= TODO_LIMIT) return;

    createTodo.mutate(
      { text: trimmed },
      {
        onSuccess: () => setText(""),
      }
    );
  };

  const onToggle = (id) => {
    toggleTodo.mutate(id);
  };

  const onDelete = (id) => {
    deleteTodo.mutate(id);
  };

  const completedCount = (todos || []).filter((t) => t.completed).length;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">To Do</h2>

      <form onSubmit={addTodo} className="space-y-3 mb-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input input-bordered flex-1 bg-base-200"
            placeholder="Add a task"
            aria-label="New todo"
            maxLength={240}
          />
          <button
            type="submit"
            disabled={!text.trim() || (todos || []).length >= TODO_LIMIT}
            className={`btn bg-base-200 hover:bg-base-300 rounded-full ${
              !text.trim() || (todos || []).length >= TODO_LIMIT
                ? "btn-disabled"
                : ""
            }`}
            aria-disabled={!text.trim() || (todos || []).length >= TODO_LIMIT}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            {(todos || []).length}/{TODO_LIMIT} used
          </div>
          {(todos || []).length >= TODO_LIMIT && (
            <div className="text-red-500">Task limit reached</div>
          )}
        </div>
      </form>

      <div className="bg-base-200 rounded-lg shadow-sm w-full">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {(todos || []).length} items
          </div>
          <div className="text-sm text-gray-600">
            {completedCount} completed
          </div>
        </div>

        <ul className="divide-y">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <li
                key={`skeleton-${i}`}
                className="p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-base-200 animate-pulse" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 bg-base-200 rounded w-32 animate-pulse mb-2" />
                    <div className="h-3 bg-base-200 rounded w-20 animate-pulse" />
                  </div>
                </div>

                <div className="w-48 md:w-64 flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-base-200 h-2 rounded-full w-1/3 animate-pulse" />
                  </div>
                  <div className="w-20 text-right text-sm font-semibold">
                    <div className="h-4 bg-base-200 rounded w-12 ml-auto animate-pulse" />
                  </div>
                </div>
              </li>
            ))}

          {!isLoading && (todos || []).length === 0 && (
            <li className="p-4 text-sm text-gray-500">
              No tasks yet — add one above.
            </li>
          )}

          {!isLoading &&
            (todos || []).map((t) => (
              <li
                key={t.id}
                className={`p-3 flex items-center justify-between hover:bg-base-300 ${
                  t.completed ? "opacity-80" : ""
                }`}
              >
                <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!t.completed}
                    onChange={() => onToggle(t.id)}
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
                      onDelete(t.id);
                    }}
                    aria-label={`Delete ${t.text}`}
                    className="btn bg-base-200 hover:bg-base-300 rounded btn-sm"
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
