import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

// Validate API_BASE_URL
if (!API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
  console.error("Please add NEXT_PUBLIC_BACKEND to your .env.local file");
}

// Low-level fetcher for calendar events. Accepts optional from/to ISO date strings.
export async function fetchCalendarEvents({ from, to } = {}) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const url = `${API_BASE_URL}/calendar${
    params.toString() ? "?" + params.toString() : ""
  }`;

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to fetch calendar events: ${res.status} ${txt}`);
  }
  const json = await res.json();
  // Helpful debug: log the backend response shape so UI mapping can be adjusted
  try {
    console.debug("fetchCalendarEvents response", { from, to, json });
  } catch (e) {
    // ignore logging errors in environments that restrict console
  }
  return json;
}

// Low-level POST to create a calendar event. Controller expects:
// { eventTitle, eventDescription, eventDate, eventType, eventColor }
export async function postCalendarEvent(eventPayload) {
  const res = await fetch(`${API_BASE_URL}/calendar`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventPayload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to add calendar event: ${res.status} ${txt}`);
  }
  return res.json();
}

// Low-level DELETE to remove a calendar event by id.
export async function deleteCalendarEvent(eventId) {
  if (!eventId) throw new Error("deleteCalendarEvent requires an eventId");
  const res = await fetch(
    `${API_BASE_URL}/calendar/${encodeURIComponent(eventId)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to delete calendar event: ${res.status} ${txt}`);
  }
  // Some APIs return an empty body; try to parse JSON but fall back to true
  try {
    return await res.json();
  } catch (e) {
    return true;
  }
}

// React Query hook to get calendar events. Use object form (v5).
export function useCalendarEvents({ from, to } = {}) {
  return useQuery({
    queryKey: ["calendar", { from, to }],
    queryFn: () => fetchCalendarEvents({ from, to }),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
}

// React Query mutation hook to add an event and invalidate calendar cache.
export function useAddCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventPayload) => postCalendarEvent(eventPayload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar"] });
    },
  });
}

// React Query mutation hook to delete an event and invalidate calendar cache.
export function useDeleteCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId) => deleteCalendarEvent(eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar"] });
    },
  });
}
