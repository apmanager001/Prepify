import { useQuery } from "@tanstack/react-query";
import { getTimer } from "./timerApi";

export function useTimerQuery() {
  return useQuery({
    queryKey: ["timer"],
    queryFn: getTimer,
  });
}
