"use client";
import React, { useEffect, useMemo, useState } from "react";
import { History, Timer } from "lucide-react";
import {
  useAddTimerMutation,
  useActiveTimerQuery,
  useDeleteActiveTimerMutation,
} from "./timer";

const INITIAL_PRESETS = [
  { id: "pomodoro", label: "Pomodoro 25:00", minutes: 25 },
  { id: "deep-focus", label: "Deep Focus 45:00", minutes: 45 },
  { id: "quick-sprint", label: "Quick Sprint 15:00", minutes: 15 },
  { id: "long-session", label: "Long Session 60:00", minutes: 60 },
];

const formatTime = (seconds) => {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const parseTimerString = (time) => {
  if (!time || typeof time !== "string") return 0;
  const parts = time.split(":").map(Number);
  if (parts.length !== 2 || parts.some((value) => !Number.isFinite(value))) {
    return 0;
  }
  return parts[0] * 60 + parts[1];
};

const FocusTimer = () => {
  const [customPreset, setCustomPreset] = useState(null);
  const [customLabel, setCustomLabel] = useState("");
  const [customMinutes, setCustomMinutes] = useState(25);
  const [selectedPresetId, setSelectedPresetId] = useState("pomodoro");
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tickCount = 60;
  const tickStep = 360 / tickCount;
  const ringRadius = 39;
  const ringStrokeWidth = 4;
  const tickInnerY = 50 - ringRadius - ringStrokeWidth / 2 - 0.6;

  const CUSTOM_OPTION_ID = "custom";
  const ACTIVE_OPTION_ID = "active";

  const allPresets = useMemo(() => INITIAL_PRESETS, []);
  const activeTimerQuery = useActiveTimerQuery({
    onError: (err) => {
      console.error("Failed to load active timer:", err);
      setErrorMessage("Unable to fetch active timer.");
    },
  });

  const activeTimerData = activeTimerQuery.data;
  const hasActiveTimer = Boolean(activeTimerData && !activeTimerData.completed);

  const selectedPreset = useMemo(() => {
    if (selectedPresetId === ACTIVE_OPTION_ID && hasActiveTimer) {
      return {
        id: ACTIVE_OPTION_ID,
        label: `${activeTimerData.name} ${activeTimerData.time}`,
        minutes: parseTimerString(activeTimerData.time) / 60,
      };
    }

    if (selectedPresetId === CUSTOM_OPTION_ID) {
      return {
        id: CUSTOM_OPTION_ID,
        label: customPreset
          ? `${customPreset.name} ${customPreset.minutes}:00`
          : "Custom timer",
        minutes: customPreset ? customPreset.minutes : customMinutes,
      };
    }

    return (
      allPresets.find((preset) => preset.id === selectedPresetId) ??
      INITIAL_PRESETS[0]
    );
  }, [allPresets, selectedPresetId, customMinutes, customPreset, activeTimerData, hasActiveTimer]);

  useEffect(() => {
    if (!isRunning && !isPaused) {
      setRemainingSeconds(selectedPreset.minutes * 60);
    }
  }, [selectedPreset, isRunning, isPaused]);

  useEffect(() => {
    const stored = window.localStorage.getItem("focusTimerCustomPreset");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (
        parsed &&
        typeof parsed.name === "string" &&
        Number.isFinite(parsed.minutes) &&
        parsed.minutes > 0
      ) {
        setCustomPreset(parsed);
        setSelectedPresetId(CUSTOM_OPTION_ID);
        setCustomLabel(parsed.name);
        setCustomMinutes(parsed.minutes);
      }
    } catch {
      // ignore invalid local storage value
    }
  }, []);

  useEffect(() => {
    if (customPreset) {
      window.localStorage.setItem(
        "focusTimerCustomPreset",
        JSON.stringify(customPreset),
      );
    } else {
      window.localStorage.removeItem("focusTimerCustomPreset");
    }
  }, [customPreset]);

  useEffect(() => {
    if (selectedPresetId === CUSTOM_OPTION_ID && customPreset) {
      setCustomLabel(customPreset.name);
      setCustomMinutes(customPreset.minutes);
    }
  }, [selectedPresetId, customPreset]);

  useEffect(() => {
    if (hasActiveTimer) {
      const totalSeconds = parseTimerString(activeTimerData.time);
      const createdAtMs = activeTimerData.createdAt
        ? new Date(activeTimerData.createdAt).getTime()
        : null;
      const elapsedSeconds = createdAtMs
        ? Math.round((Date.now() - createdAtMs) / 1000)
        : 0;
      const remaining = Math.max(totalSeconds - elapsedSeconds, 0);

      // setSelectedPresetId(ACTIVE_OPTION_ID);
      setIsRunning(true);
      setIsPaused(false);
      setRemainingSeconds(remaining);
      return;
    }

    if (!hasActiveTimer && selectedPresetId === ACTIVE_OPTION_ID) {
      setSelectedPresetId(INITIAL_PRESETS[0].id);
    }
  }, [hasActiveTimer, activeTimerData, selectedPresetId]);

  useEffect(() => {
    if (isRunning || isPaused) return;
    setRemainingSeconds(selectedPreset.minutes * 60);
  }, [selectedPreset, isRunning, isPaused]);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const id = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsPaused(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, isPaused]);

  const handleStartStop = async () => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(false);
      return;
    }

    if (activeTimerData) {
      setErrorMessage(
        "An active timer is already running. Please stop it first.",
      );
      return;
    }

    setErrorMessage("");
    setIsPaused(false);
    setIsRunning(true);
  };

  const handlePauseResume = () => {
    if (!isRunning) return;
    setIsPaused((prev) => !prev);
  };

  const addTimerMutation = useAddTimerMutation();

  const handleCreateCustomTimer = async (e) => {
    e.preventDefault();
    if (!customLabel.trim()) {
      setErrorMessage("Custom timer label is required.");
      return;
    }
    if (!Number.isFinite(customMinutes) || customMinutes <= 0) {
      setErrorMessage("Custom timer minutes must be greater than 0.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await addTimerMutation.mutateAsync({
        name: customLabel.trim(),
        minutes: customMinutes,
      });
      const newPreset = {
        id: CUSTOM_OPTION_ID,
        name: customLabel.trim(),
        minutes: customMinutes,
      };
      setCustomPreset(newPreset);
      setSelectedPresetId(CUSTOM_OPTION_ID);
      setInfoMessage("Custom timer saved. Select it and start focus.");
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to add custom timer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteActiveTimerMutation = useDeleteActiveTimerMutation();

  const handleClearActiveTimer = async () => {
    if (!activeTimerData) return;
    try {
      await deleteActiveTimerMutation.mutateAsync();
      setInfoMessage("Active timer cleared.");
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to clear active timer.");
    }
  };

  const handleDeleteCustomPreset = () => {
    setCustomPreset(null);
    setSelectedPresetId(INITIAL_PRESETS[0].id);
    setCustomLabel("");
    setCustomMinutes(25);
    setInfoMessage("Custom timer removed.");
  };

  const totalSeconds = selectedPreset.minutes * 60;
  const progressRatio = useMemo(() => {
    if (!totalSeconds) return 0;
    return remainingSeconds / totalSeconds;
  }, [remainingSeconds, totalSeconds]);

  const activeTickCount = useMemo(() => {
    if (!remainingSeconds) return 0;
    return Math.max(1, Math.ceil(progressRatio * tickCount));
  }, [progressRatio, remainingSeconds, tickCount]);

  const elapsedTickCount = tickCount - activeTickCount;

  const tickMarks = useMemo(
    () =>
      Array.from({ length: tickCount }, (_, index) => ({
        index,
        rotation: 0 + index * tickStep,
        length:
          index % 15 === 0
            ? 8
            : index % 5 === 0
              ? 6.4
              : index % 2 === 0
                ? 5
                : 3.8,
        isActive: index >= elapsedTickCount,
      })),
    [elapsedTickCount, tickCount, tickStep],
  );

  const tickMarksColor = "hsl(26 89.6% 71.5%)";
  const timerScaleVars = {
    "--timer-size": "18rem",
    "--timer-inner-inset": "1rem",
    "--timer-time-size": "3rem",
    "--timer-select-max-width": "13rem",
    "--timer-content-padding-x": "1.5rem",
    "--timer-vertical-padding": "1.5rem",
    "--timer-gap": "1.5rem",
    "--timer-button-min-width": "10rem",
    "--timer-button-height": "3rem",
    "--timer-button-font-size": "1rem",
    "--timer-title-font-size": "0.875rem",
    "--timer-title-gap": "0.5rem",
    "--timer-title-padding-x": "0.5rem",
    "--timer-title-padding-y": "0.5rem",
    "--timer-title-icon-size": "1.125rem",
    "--timer-title-icon-padding": "0.5rem",
    "--timer-history-font-size": "0.875rem",
    "--timer-history-icon-size": "1rem",
  };

  return (
    <div
      className="bg-base-100 rounded-lg shadow-sm w-full border border-base-content/20 p-2 h-full [--timer-scale:0.74] xl:[--timer-scale:1]"
      style={timerScaleVars}
    >
      <div className="flex items-center justify-between border-b border-base-content/20 pb-3">
        <div
          className="bg-base-100 rounded-lg text-neutral font-medium flex items-center"
          style={{
            fontSize:
              "calc(var(--timer-title-font-size) * max(var(--timer-scale), 0.9))",
            gap: "calc(var(--timer-title-gap) * var(--timer-scale))",
            paddingInline:
              "calc(var(--timer-title-padding-x) * var(--timer-scale))",
            paddingBlock:
              "calc(var(--timer-title-padding-y) * var(--timer-scale))",
          }}
        >
          <div
            className="flex items-center text-neutral-content border-3 border-primary bg-neutral rounded-xl hover:scale-105"
            style={{
              fontSize:
                "calc(var(--timer-title-icon-size) * max(var(--timer-scale), 0.9))",
              padding:
                "calc(var(--timer-title-icon-padding) * var(--timer-scale))",
            }}
          >
            <Timer />
          </div>
          Focus Timer
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm normal-case text-base-content/70"
          style={{
            fontSize:
              "calc(var(--timer-history-font-size) * max(var(--timer-scale), 0.9))",
          }}
        >
          <History
            style={{
              height:
                "calc(var(--timer-history-icon-size) * max(var(--timer-scale), 0.9))",
              width:
                "calc(var(--timer-history-icon-size) * max(var(--timer-scale), 0.9))",
            }}
          />
          <span>History</span>
        </button>
      </div>

      <div
        className="flex flex-col items-center"
        style={{
          gap: "calc(var(--timer-gap) * var(--timer-scale))",
          paddingBlock:
            "calc(var(--timer-vertical-padding) * var(--timer-scale))",
        }}
      >
        <div
          className="relative overflow-hidden rounded-full shadow-inner"
          style={{
            backgroundColor: "var(--color-base-200)",
            height: "calc(var(--timer-size) * var(--timer-scale))",
            width: "calc(var(--timer-size) * var(--timer-scale))",
          }}
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            style={{ color: tickMarksColor }}
          >
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              style={{
                stroke: "var(--color-base-content)",
                strokeOpacity: 0.12,
              }}
              strokeWidth={ringStrokeWidth}
            />
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              pathLength="100"
              style={{ stroke: "currentColor", strokeOpacity: 0.22 }}
              strokeDasharray={`${progressRatio * 100} 100`}
              strokeLinecap="round"
              strokeWidth={ringStrokeWidth}
              transform="rotate(-90 50 50)"
            />

            {tickMarks.map((tick) => (
              <line
                key={`guide-${tick.index}`}
                x1="50"
                x2="50"
                y1={tickInnerY - Math.max(2.6, tick.length - 1.4)}
                y2={tickInnerY}
                style={{
                  stroke: "var(--color-base-content)",
                  strokeOpacity: 0.3,
                }}
                strokeLinecap="round"
                strokeWidth={tick.length >= 6 ? 1.2 : 0.95}
                transform={`rotate(${tick.rotation} 50 50)`}
              />
            ))}

            {tickMarks.map((tick) =>
              tick.isActive ? (
                <line
                  key={`active-${tick.index}`}
                  x1="50"
                  x2="50"
                  y1={tickInnerY - tick.length}
                  y2={tickInnerY}
                  style={{
                    stroke: "currentColor",
                    strokeOpacity: 1,
                    filter:
                      "drop-shadow(0 0 2.5px color-mix(in oklab, currentColor 45%, transparent))",
                  }}
                  strokeLinecap="round"
                  strokeWidth={tick.length >= 6 ? 1.9 : 1.55}
                  transform={`rotate(${tick.rotation} 50 50)`}
                />
              ) : null,
            )}
          </svg>

          <div
            className="absolute rounded-full border border-base-content/10 bg-base-100 flex flex-col items-center justify-center text-center"
            style={{
              inset: "calc(var(--timer-inner-inset) * var(--timer-scale))",
              paddingInline:
                "calc(var(--timer-content-padding-x) * var(--timer-scale))",
            }}
          >
            <div
              className="font-bold tabular-nums tracking-tight leading-none"
              style={{
                fontSize: "calc(var(--timer-time-size) * var(--timer-scale))",
              }}
            >
              {formatTime(remainingSeconds)}
            </div>

            <select
              className="select select-sm w-full"
              id="focus-timer-preset-select"
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              disabled={isRunning || Boolean(false)}
              style={{
                fontSize: "calc(0.875rem * max(var(--timer-scale), 0.85))",
                marginTop: "calc(0.75rem * var(--timer-scale))",
                maxWidth:
                  "calc(var(--timer-select-max-width) * var(--timer-scale))",
              }}
            >
              {allPresets.map((preset, index) => (
                <option
                  key={preset.id}
                  value={preset.id}
                  id={`focus-timer-preset-option-${index}`}
                >
                  {preset.label}
                </option>
              ))}
              {activeTimerData ? (
                <option value={ACTIVE_OPTION_ID} id="focus-timer-preset-option-active">
                  {`${activeTimerData.name} ${activeTimerData.time}`}
                </option>
              ) : (
                <option value={CUSTOM_OPTION_ID} id="focus-timer-preset-option-custom">
                  {customPreset ? `${customPreset.name} ${customPreset.minutes}:00` : "Custom timer"}
                </option>
              )}
            </select>
          </div>
        </div>

        {selectedPresetId === CUSTOM_OPTION_ID && (
          <div className="w-full max-w-sm space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="input-group input-group-vertical">
              <span>Name</span>
              <input
                type="text"
                className="input input-bordered w-full"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Deep Work"
              />
            </label>
            <label className="input-group input-group-vertical">
              <span>Minutes</span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={customMinutes}
                min={1}
                max={240}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-secondary flex-1"
              onClick={handleCreateCustomTimer}
              disabled={isSubmitting}
            >
              {customPreset ? "Update Custom Timer" : "Add Custom Timer"}
            </button>
            {customPreset && (
              <button
                type="button"
                className="btn btn-error flex-1"
                onClick={handleDeleteCustomPreset}
                disabled={isSubmitting}
              >
                Delete Custom Timer
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-error bg-error/10 px-3 py-2 text-sm text-error">
              {errorMessage}
            </div>
          )}

          {infoMessage && (
            <div className="rounded-lg border border-success bg-success/10 px-3 py-2 text-sm text-success">
              {infoMessage}
            </div>
          )}

          {activeTimerData && (
            <div className="rounded-lg border border-primary bg-primary/10 px-3 py-2 text-sm text-primary">
              <div className="font-semibold">Active timer:</div>
              <div>{activeTimerData.name}</div>
              <div className="text-xs">
                Remaining: {formatTime(remainingSeconds)}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm mt-2"
                onClick={handleClearActiveTimer}
              >
                Clear Active Timer
              </button>
            </div>
          )}
        </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            className={`btn ${isRunning ? "btn-neutral" : "btn-primary"}`}
            id="focus-timer-start-stop-button"
            onClick={handleStartStop}
            style={{
              fontSize:
                "calc(var(--timer-button-font-size) * max(var(--timer-scale), 0.88))",
              height: "calc(var(--timer-button-height) * var(--timer-scale))",
              minHeight:
                "calc(var(--timer-button-height) * var(--timer-scale))",
              minWidth:
                "calc(var(--timer-button-min-width) * var(--timer-scale))",
              paddingInline: "calc(1rem * var(--timer-scale))",
            }}
          >
            {isRunning ? "Stop Focus" : "Start Focus"}
          </button>
          {isRunning && (
            <button
              type="button"
              className="btn"
              id="focus-timer-pause-resume-button"
              onClick={handlePauseResume}
              style={{
                fontSize:
                  "calc(var(--timer-button-font-size) * max(var(--timer-scale), 0.88))",
                height: "calc(var(--timer-button-height) * var(--timer-scale))",
                minHeight:
                  "calc(var(--timer-button-height) * var(--timer-scale))",
                minWidth:
                  "calc(var(--timer-button-min-width) * var(--timer-scale))",
                paddingInline: "calc(1rem * var(--timer-scale))",
              }}
            >
              {isPaused ? "Resume Focus" : "Pause Focus"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
