import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/backendAPI";

const parseResponseBody = async (res) => {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
};

const getErrorMessage = (res, body) => {
  return (
    (body && body.error) ||
    (typeof body === "string" && body) ||
    res.statusText ||
    `Request failed with status ${res.status}`
  );
};

export async function getTimerApi() {
  const res = await fetch(`${API_BASE_URL}/timer`, { credentials: "include" });
  const body = await parseResponseBody(res);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch timers: ${res.status} ${getErrorMessage(res, body)}`,
    );
  }

  return body;
}

export async function getActiveTimerApi() {
  const res = await fetch(`${API_BASE_URL}/timer/active`, {
    credentials: "include",
  });
  if (res.status === 404) {
    return null;
  }

  const body = await parseResponseBody(res);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch active timer: ${res.status} ${getErrorMessage(res, body)}`,
    );
  }

  return body;
}

export async function addTimerApi(timerData) {
  const name = String(timerData?.name ?? "").trim();
  const minutes = Number(timerData?.minutes);
  const timeInput = timerData?.time ? String(timerData.time).trim() : null;

  if (!name) {
    throw new Error("Timer name cannot be empty.");
  }

  if (timeInput) {
    const timeParts = timeInput.split(":").map((part) => Number(part));
    if (
      timeParts.length !== 2 ||
      timeParts.some((value) => !Number.isFinite(value) || value < 0)
    ) {
      throw new Error("Time must be a valid string in the format 'MM:SS'.");
    }
  }

  if (!timeInput) {
    if (!Number.isFinite(minutes) || minutes <= 0) {
      throw new Error("Minutes must be a positive number.");
    }
  }

  const time = timeInput
    ? timeInput
    : `${String(Math.floor(minutes)).padStart(2, "0")}:00`;

  const res = await fetch(`${API_BASE_URL}/timer`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, time }),
  });

  const body = await parseResponseBody(res);
  if (!res.ok) {
    throw new Error(
      `Failed to add timer: ${res.status} ${getErrorMessage(res, body)}`,
    );
  }

  return body;
}

export async function deleteActiveTimerApi() {
  const res = await fetch(`${API_BASE_URL}/timer/active`, {
    method: "DELETE",
    credentials: "include",
  });

  const body = await parseResponseBody(res);
  if (!res.ok) {
    throw new Error(
      `Failed to delete active timer: ${res.status} ${getErrorMessage(res, body)}`,
    );
  }

  return body;
}

export async function completeActiveTimerApi() {
  const res = await fetch(`${API_BASE_URL}/timer/active`, {
    method: "PUT",
    credentials: "include",
  });

  const body = await parseResponseBody(res);
  if (!res.ok) {
    throw new Error(
      `Failed to complete active timer: ${res.status} ${getErrorMessage(res, body)}`,
    );
  }

  return body;
}

export function useTimersQuery(options = {}) {
  return useQuery({ queryKey: ["timers"], queryFn: getTimerApi, ...options });
}

export function useActiveTimerQuery(options = {}) {
  return useQuery({
    queryKey: ["activeTimer"],
    queryFn: getActiveTimerApi,
    retry: false,
    ...options,
  });
}

export function useAddTimerMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTimerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTimer"] });
      queryClient.invalidateQueries({ queryKey: ["timers"] });
    },
    ...options,
  });
}

export function useDeleteActiveTimerMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActiveTimerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTimer"] });
      queryClient.invalidateQueries({ queryKey: ["timers"] });
    },
    ...options,
  });
}

export function useCompleteActiveTimerMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeActiveTimerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTimer"] });
      queryClient.invalidateQueries({ queryKey: ["timers"] });
    },
    ...options,
  });
}
