import { useMutation } from "@tanstack/react-query";
import { addTimer } from "./timerApi";

export function useAddTimerMutation(options) {
  return useMutation({
    mutationFn: addTimer,
    ...options,
  });
}
