import { useQuery } from "@tanstack/react-query";
import { getProfile, getStudyGoals } from "./settingsApi";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    // Always refetch on mount so Header sees the latest
    // auth state after a logout redirect back to "/".
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useStudyGoalsQuery() {
  return useQuery({
    queryKey: ["studyGoals"],
    queryFn: getStudyGoals,
  });
}
