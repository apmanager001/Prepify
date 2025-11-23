import { useQuery } from "@tanstack/react-query";
import { getProfile, getStudyGoals } from "./settingsApi";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}

export function useStudyGoalsQuery() {
  return useQuery({
    queryKey: ["studyGoals"],
    queryFn: getStudyGoals,
  });
}
