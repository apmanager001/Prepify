// lib/api/score.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "./backendAPI";

type ScoreRule = {
  type: string;
  points: number;
  dailyCap: number;
  note?: string;
};

type AddScorePayload = {
  userId: string;
  actionType: string;
};

type AddScoreResponse = {
  success: boolean;
  newPoints: number;
};

// Fetch score rules (optional, for UI display)
export const useScoreRules = () =>
  useQuery<ScoreRule[]>({
    queryKey: ["scoreRules"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/scoreRules`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
  });

// Add score for a user action
export const useAddScore = () => {
  const queryClient = useQueryClient();

  return useMutation<AddScoreResponse, Error, AddScorePayload>({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_BASE_URL}/addScore`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: () => {
      // Optionally refetch user score or profile
      queryClient.invalidateQueries({ queryKey: ["userScore"] });
    },
  });
};
