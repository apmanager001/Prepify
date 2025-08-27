"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  Timer,
  BookOpen,
  Target,
  Brain,
  Coffee,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Settings,
  Check,
  X,
} from "lucide-react";

const Tools = () => {
  // Tool visibility states
  const [visibleTools, setVisibleTools] = useState({
    pomodoro: false,
    music: false,
    focusMode: false,
    studyStreak: false,
    ambientSounds: false,
    progressTracker: false,
    breakReminder: false,
    darkMode: false,
  });

  // Pomodoro timer states
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [timerMode, setTimerMode] = useState("work"); // work, shortBreak, longBreak
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Music player states
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);

  // Study streak states
  const [studyStreak, setStudyStreak] = useState(0);
  const [todayStudied, setTodayStudied] = useState(false);

  // Focus mode states
  const [focusMode, setFocusMode] = useState(false);
  const [focusDuration, setFocusDuration] = useState(45);

  // Ambient sounds states
  const [ambientSounds, setAmbientSounds] = useState({
    rain: false,
    whiteNoise: false,
    nature: false,
    cafe: false,
  });

  // Progress tracker states
  const [studyGoals, setStudyGoals] = useState([
    { id: 1, text: "Complete 3 practice tests", completed: false },
    { id: 2, text: "Review 2 chapters", completed: false },
    { id: 3, text: "Practice flashcards for 30 minutes", completed: false },
  ]);

  // Timer configurations
  const timerConfigs = {
    work: { time: 25 * 60, label: "Work" },
    shortBreak: { time: 5 * 60, label: "Short Break" },
    longBreak: { time: 15 * 60, label: "Long Break" },
  };

  // Music tracks
  const musicTracks = [
    { name: "Classical Focus", genre: "Classical", duration: "2:45" },
    { name: "Lo-Fi Beats", genre: "Lo-Fi", duration: "3:12" },
    { name: "Nature Sounds", genre: "Ambient", duration: "4:20" },
    { name: "Jazz Study", genre: "Jazz", duration: "3:45" },
    { name: "White Noise", genre: "Ambient", duration: "5:00" },
  ];

  // Toggle tool visibility
  const toggleTool = (toolName) => {
    setVisibleTools((prev) => ({
      ...prev,
      [toolName]: !prev[toolName],
    }));
  };

  // Pomodoro timer functions
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
      if (timerMode === "work") {
        setCompletedPomodoros((prev) => prev + 1);
        setTimerMode("shortBreak");
        setTimeLeft(timerConfigs.shortBreak.time);
      } else {
        setTimerMode("work");
        setTimeLeft(timerConfigs.work.time);
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, timerMode]);

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerConfigs.work.time);
    setTimerMode("work");
  };

  const switchTimerMode = (mode) => {
    setTimerMode(mode);
    setTimeLeft(timerConfigs[mode].time);
    setTimerRunning(false);
  };

  // Music player functions
  const toggleMusic = () => setMusicPlaying(!musicPlaying);
  const nextTrack = () =>
    setCurrentTrack((prev) => (prev + 1) % musicTracks.length);
  const prevTrack = () =>
    setCurrentTrack(
      (prev) => (prev - 1 + musicTracks.length) % musicTracks.length
    );
  const toggleMute = () => setMuted(!muted);

  // Study streak functions
  const markTodayStudied = () => {
    if (!todayStudied) {
      setStudyStreak((prev) => prev + 1);
      setTodayStudied(true);
    }
  };

  // Focus mode functions
  const toggleFocusMode = () => setFocusMode(!focusMode);

  // Ambient sounds functions
  const toggleAmbientSound = (sound) => {
    setAmbientSounds((prev) => ({
      ...prev,
      [sound]: !prev[sound],
    }));
  };

  // Progress tracker functions
  const toggleGoal = (goalId) => {
    setStudyGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const addGoal = (text) => {
    const newGoal = {
      id: Date.now(),
      text,
      completed: false,
    };
    setStudyGoals((prev) => [...prev, newGoal]);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Study Tools</h1>
        <p className="text-lg text-gray-600">
          Customize your study environment with these helpful tools
        </p>
      </div>

      {/* Tool Toggles */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(visibleTools).map(([tool, isVisible]) => {
            const toolConfigs = {
              pomodoro: {
                icon: Timer,
                label: "Pomodoro Timer",
                color: "bg-red-500",
              },
              music: {
                icon: Music,
                label: "Study Music",
                color: "bg-blue-500",
              },
              focusMode: {
                icon: Target,
                label: "Focus Mode",
                color: "bg-green-500",
              },
              studyStreak: {
                icon: Brain,
                label: "Study Streak",
                color: "bg-purple-500",
              },
              ambientSounds: {
                icon: Volume2,
                label: "Ambient Sounds",
                color: "bg-yellow-500",
              },
              progressTracker: {
                icon: BookOpen,
                label: "Progress Tracker",
                color: "bg-indigo-500",
              },
              breakReminder: {
                icon: Coffee,
                label: "Break Reminder",
                color: "bg-orange-500",
              },
              darkMode: {
                icon: Moon,
                label: "Dark Mode",
                color: "bg-gray-500",
              },
            };

            const config = toolConfigs[tool];
            const Icon = config.icon;

            return (
              <button
                key={tool}
                onClick={() => toggleTool(tool)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isVisible
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{config.label}</p>
                    <p className="text-sm text-gray-500">
                      {isVisible ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pomodoro Timer */}
      {visibleTools.pomodoro && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Timer className="text-red-500" size={28} />
            <span>Pomodoro Timer</span>
          </h2>

          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-gray-900 mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className="text-lg text-gray-600 mb-6">
              {timerConfigs[timerMode].label} Session
            </div>

            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={startTimer}
                disabled={timerRunning}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Start</span>
              </button>

              <button
                onClick={pauseTimer}
                disabled={!timerRunning}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <Pause size={20} />
                <span>Pause</span>
              </button>

              <button
                onClick={resetTimer}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2">
              {Object.entries(timerConfigs).map(([mode, config]) => (
                <button
                  key={mode}
                  onClick={() => switchTimerMode(mode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    timerMode === mode
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Completed Pomodoros:{" "}
              <span className="font-bold text-primary">
                {completedPomodoros}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Study Music Player */}
      {visibleTools.music && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Music className="text-blue-500" size={28} />
            <span>Study Music</span>
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {musicTracks[currentTrack].name}
                </h3>
                <p className="text-gray-600">
                  {musicTracks[currentTrack].genre} •{" "}
                  {musicTracks[currentTrack].duration}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={prevTrack}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors duration-200"
                >
                  <RotateCcw size={20} />
                </button>

                <button
                  onClick={toggleMusic}
                  className="w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  {musicPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors duration-200"
                >
                  <RotateCcw size={20} className="rotate-180" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors duration-200"
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={muted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />

              <span className="text-sm text-gray-600 w-12 text-right">
                {muted ? 0 : volume}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {musicTracks.map((track, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  currentTrack === index
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setCurrentTrack(index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{track.name}</p>
                    <p className="text-sm text-gray-600">{track.genre}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {track.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Focus Mode */}
      {visibleTools.focusMode && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Target className="text-green-500" size={28} />
            <span>Focus Mode</span>
          </h2>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Deep Focus Session
              </h3>
              <p className="text-gray-600">
                Block distractions and maintain concentration
              </p>
            </div>

            <button
              onClick={toggleFocusMode}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                focusMode
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            </button>
          </div>

          {focusMode && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-medium">
                  Focus Mode Active
                </span>
              </div>
              <p className="text-green-700 text-sm">
                You're in a {focusDuration}-minute focus session. Stay focused
                and avoid distractions!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Study Streak */}
      {visibleTools.studyStreak && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Brain className="text-purple-500" size={28} />
            <span>Study Streak</span>
          </h2>

          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-purple-500 mb-2">
              {studyStreak}
            </div>
            <p className="text-lg text-gray-600 mb-4">Day Study Streak</p>

            <button
              onClick={markTodayStudied}
              disabled={todayStudied}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                todayStudied
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
            >
              {todayStudied ? (
                <span className="flex items-center space-x-2">
                  <Check size={20} />
                  <span>Studied Today!</span>
                </span>
              ) : (
                <span>Mark Today as Studied</span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`h-12 rounded-lg border-2 ${
                  i < studyStreak % 7
                    ? "bg-purple-500 border-purple-500"
                    : "bg-gray-100 border-gray-200"
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Ambient Sounds */}
      {visibleTools.ambientSounds && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Volume2 className="text-yellow-500" size={28} />
            <span>Ambient Sounds</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(ambientSounds).map(([sound, isActive]) => {
              const soundConfigs = {
                rain: { label: "Rain", icon: "🌧️", color: "bg-blue-500" },
                whiteNoise: {
                  label: "White Noise",
                  icon: "🔊",
                  color: "bg-gray-500",
                },
                nature: { label: "Nature", icon: "🌿", color: "bg-green-500" },
                cafe: { label: "Cafe", icon: "☕", color: "bg-orange-500" },
              };

              const config = soundConfigs[sound];

              return (
                <button
                  key={sound}
                  onClick={() => toggleAmbientSound(sound)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{config.icon}</div>
                    <p className="font-medium text-gray-900">{config.label}</p>
                    <p className="text-sm text-gray-500">
                      {isActive ? "Playing" : "Click to play"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Tracker */}
      {visibleTools.progressTracker && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <BookOpen className="text-indigo-500" size={28} />
            <span>Progress Tracker</span>
          </h2>

          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                placeholder="Add a new study goal..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    addGoal(e.target.value.trim());
                    e.target.value = "";
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector(
                    'input[placeholder="Add a new study goal..."]'
                  );
                  if (input && input.value.trim()) {
                    addGoal(input.value.trim());
                    input.value = "";
                  }
                }}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors duration-200"
              >
                Add Goal
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {studyGoals.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                  goal.completed
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      goal.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {goal.completed && <Check size={16} />}
                  </button>

                  <span
                    className={`font-medium ${
                      goal.completed
                        ? "text-green-700 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {goal.text}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setStudyGoals((prev) =>
                      prev.filter((g) => g.id !== goal.id)
                    );
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Break Reminder */}
      {visibleTools.breakReminder && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Coffee className="text-orange-500" size={28} />
            <span>Break Reminder</span>
          </h2>

          <div className="text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coffee size={48} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Time for a Break!
            </h3>
            <p className="text-gray-600 mb-6">
              Take regular breaks to maintain focus and prevent burnout
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800 text-sm">
                💡 <strong>Tip:</strong> Follow the 20-20-20 rule: Every 20
                minutes, look at something 20 feet away for 20 seconds
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dark Mode Toggle */}
      {visibleTools.darkMode && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Moon className="text-gray-500" size={28} />
            <span>Theme Settings</span>
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Dark Mode</h3>
              <p className="text-gray-600">
                Switch between light and dark themes
              </p>
            </div>

            <label className="flex cursor-pointer gap-2">
              <Sun />
              <input
                type="checkbox"
                value="synthwave"
                className="toggle theme-controller"
              />
              <Moon />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;
