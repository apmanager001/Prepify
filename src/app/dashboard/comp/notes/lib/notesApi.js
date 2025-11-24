import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/backendAPI";
import { addScoreAndInvalidate } from "../../dashboardComps/useTotalScore";
import toast from "react-hot-toast";

async function safeParse(res) {
  const txt = await res.text().catch(() => "");
  try {
    return txt ? JSON.parse(txt) : {};
  } catch (e) {
    return e;
  }
}

export async function fetchNotes() {
  const res = await fetch(`${API_BASE_URL}/notes`, { credentials: "include" });
  if (!res.ok) {
    const body = await safeParse(res);
    throw new Error(body?.message || `Status ${res.status}`);
  }
  return safeParse(res);
}

export async function createNote(payload) {
  const res = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await safeParse(res);
    throw new Error(body?.message || `Status ${res.status}`);
  }

  // use the shared helper that also invalidates query cache
  const { status } = await addScoreAndInvalidate("addNotesItem");
  if (status === 206) {
    toast.success("Note created, but you have reached your daily score cap for notes today");
  } else if (status === 207) {
    toast.success("Note created, but you have reached your cap for daily points");
  } else if(status === 201 || status === 214) {
    toast.success("Note created");
  } else {
    console.error("Failed to award Note points:", err);
  }

  return safeParse(res);
}

export async function updateNote(noteId, payload) {
  const res = await fetch(
    `${API_BASE_URL}/notes/${encodeURIComponent(noteId)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const body = await safeParse(res);
    throw new Error(body?.message || `Status ${res.status}`);
  }
  return safeParse(res);
}

export async function deleteNoteReq(noteId) {
  const res = await fetch(
    `${API_BASE_URL}/notes/${encodeURIComponent(noteId)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) {
    const body = await safeParse(res);
    throw new Error(body?.message || `Status ${res.status}`);
  }
  return safeParse(res);
}

// React Query hooks (v5 object signature)
export function useNotes(options = {}) {
  return useQuery({ queryKey: ["notes"], queryFn: fetchNotes, ...options });
}

export function useCreateNote(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createNote(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
    },
    ...options,
  });
}

export function useUpdateNote(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateNote(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
    },
    ...options,
  });
}

export function useDeleteNote(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteNoteReq(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
    },
    ...options,
  });
}
