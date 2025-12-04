"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/backendAPI";
import { addScoreAndInvalidate } from "../../dashboardComps/useTotalScore";
import toast from "react-hot-toast";

async function fetchTodos() {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || "Failed to fetch todos");
  }

  const data = await res.json();
  // normalize different shapes to an array
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.todos)
    ? data.todos
    : [];

  // normalize server _id to id for easier client consumption
  return items.map((t) => ({ ...t, id: t._id ?? t.id }));
}

async function createTodoApi(payload) {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || "Failed to create todo");
  }
  const todo = await res.json();


  const { status } = await addScoreAndInvalidate("addToDoItem");
  if (status === 206) {
    toast.success(
      "To Do item created, but you have reached your daily score cap for to do items today"
    );
  } else if (status === 207) {
    toast.success(
      "To Do item created, but you have reached your cap for daily points"
    );
  } else if (status === 201 || status === 214) {
    toast.success("To Do item created");
  } else {
    console.error("Failed to award To Do points:", err);
  }


  return { ...todo, id: todo._id ?? todo.id };
}

async function toggleTodoApi(id) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || "Failed to toggle todo");
  }

  const todo = await res.json();
  return { ...todo, id: todo._id ?? todo.id };
}

async function deleteTodoApi(id) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || "Failed to delete todo");
  }

  return await res.json();
}

// React Query hooks
export function useTodos(options = {}) {
  return useQuery({ queryKey: ["todos"], queryFn: fetchTodos, ...options });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTodoApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      toast.error(err?.message ?? "Failed to add task");
    },
  });
}

export function useToggleTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleTodoApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task updated");
    },
    onError: (err) => {
      toast.error(err?.message ?? "Failed to update task");
    },
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTodoApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task deleted");
    },
    onError: (err) => {
      toast.error(err?.message ?? "Failed to delete task");
    },
  });
}

export const todoApi = {
  fetchTodos,
  createTodoApi,
  toggleTodoApi,
  deleteTodoApi,
};
