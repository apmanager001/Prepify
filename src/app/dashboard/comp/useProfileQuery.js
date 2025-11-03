import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./settingsApi";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}
