import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/backendAPI";

async function safeParse(res) {
  const txt = await res.text().catch(() => "");
  try {
    return txt ? JSON.parse(txt) : {};
  } catch (e) {
    return txt;
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
