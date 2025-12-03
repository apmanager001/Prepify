// Zustand + persistence
import { create } from "zustand";
import { persist } from "zustand/middleware";
// Server API functions
import {
  getTimer,
  deleteTimer,
  addTimer,
} from "@/app/dashboard/comp/dashboardComps/focusTimers/timerApi";

export const useTimerStore = create(
  persist(
    (set, get) => {
      // Global interval ID for ticking all running timers
      let intervalId = null;

      // GLOBAL TICKER (runs every 250ms)
      const startGlobalTicker = () => {
        if (intervalId) return;

        intervalId = setInterval(() => {
          const timers = get().timers;

          // Update all running timers
          const updated = timers.map((t) => {
            if (!t.isRunning) return t;

            const remaining = (t.endsAt - Date.now()) / 1000;

            // When timer reaches zero → reset it
            if (remaining <= 0) {
              return {
                ...t,
                isRunning: false,
                remainingSeconds: t.durationSeconds,
                startedAt: null,
                endsAt: null,
              };
            }

            return { ...t, remainingSeconds: remaining };
          });

          set({ timers: updated });
        }, 250);
      };

      // Stop global ticker and clear interval
      const stopGlobalTicker = () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
      };

      // Build full runtime timer object
      const withRuntimeFields = (serverTimer) => ({
        name: serverTimer.name,
        minutes: serverTimer.minutes,
        durationSeconds: serverTimer.minutes * 60,

        // runtime fields
        isRunning: false,
        remainingSeconds: serverTimer.minutes * 60,
        startedAt: null,
        endsAt: null,
      });

      return {
        // Main timer list
        timers: [],

        // Marks hydration + server fetch completion
        hasHydrated: false,

        // FETCH TIMERS FROM SERVER
        fetchServerTimers: async () => {
          try {
            const body = await getTimer();
            const serverTimers = body?.timers ?? [];

            // Convert server timers into full runtime timers
            const locals = serverTimers.map(withRuntimeFields);

            set({ timers: locals });
          } catch (err) {
            console.error("Failed to load timers:", err);
          }
        },

        // CREATE TIMER
        createTimer: async (timerData) => {
          await addTimer(timerData);

          const localTimer = withRuntimeFields(timerData);

          set({ timers: [...get().timers, localTimer] });
        },

        // DELETE TIMER
        removeTimer: async (index) => {
          await deleteTimer(index);

          const updated = get().timers.filter((_, i) => i !== index);
          set({ timers: updated });

          // Stop ticker if no running timers remain
          if (!updated.some((t) => t.isRunning)) stopGlobalTicker();
        },

        // GET REMAINING SECONDS
        getRemainingSeconds: (index) => {
          const t = get().timers[index];
          if (!t) return 0;

          if (!t.isRunning) return t.remainingSeconds;

          return Math.max(0, (t.endsAt - Date.now()) / 1000);
        },

        // START TIMER
        startTimer: (index) => {
          const timers = get().timers.map((t, i) =>
            i === index
              ? {
                  ...t,
                  isRunning: true,
                  startedAt: Date.now(),
                  endsAt: Date.now() + t.remainingSeconds * 1000,
                }
              : t
          );

          set({ timers });
          startGlobalTicker();
        },

        // STOP TIMER
        stopTimer: (index) => {
          const timers = get().timers.map((t, i) => {
            if (i !== index) return t;
            // Calculate remaining time at stop moment
            const remaining = t.endsAt
              ? (t.endsAt - Date.now()) / 1000
              : t.remainingSeconds;

            return {
              ...t,
              isRunning: false,
              remainingSeconds: Math.max(0, remaining),
            };
          });

          set({ timers });
          // Stop ticker if nothing is running
          if (!timers.some((t) => t.isRunning)) stopGlobalTicker();
        },

        // RESET TIMER
        resetTimer: (index) => {
          const timers = get().timers.map((t, i) =>
            i === index
              ? {
                  ...t,
                  isRunning: false,
                  startedAt: null,
                  endsAt: null,
                  remainingSeconds: t.durationSeconds,
                }
              : t
          );

          set({ timers });

          // Stop ticker if nothing is running
          if (!timers.some((t) => t.isRunning)) stopGlobalTicker();
        },
        // Set hydration completion flag
        setHasHydrated: (value) => set({ hasHydrated: value }),
      };
    },

    // PERSISTENCE SETTINGS
    {
      name: "timer-storage",

      // After hydration: fetch fresh server timers + mark hydrated
      onRehydrateStorage: () => async (state) => {
        await state.fetchServerTimers();
        state.setHasHydrated(true);
      },
    }
  )
);
