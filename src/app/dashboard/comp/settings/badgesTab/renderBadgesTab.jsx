"use client";
import React, { useState } from "react";

const RenderBadgesTab = () => {
  const allBadges = [
    {
      key: "onboarding",
      name: "Getting Started",
      description: "Completed onboarding and set up your profile.",
      earned: true,
      icon: "star",
    },
    {
      key: "streak_7",
      name: "7-Day Streak",
      description: "Studied every day for 7 days in a row.",
      earned: true,
      icon: "trophy",
    },
    {
      key: "first_goal",
      name: "First Goal",
      description: "Completed your first study goal.",
      earned: true,
      icon: "rocket",
    },
    {
      key: "community_helper",
      name: "Helper",
      description: "Answered or helped another community member.",
      earned: true,
      icon: "heart",
    },
    {
      key: "reader",
      name: "Avid Reader",
      description: "Opened 10 study guides.",
      earned: true,
      icon: "book",
    },

    {
      key: "explorer",
      name: "Explorer",
      description: "Visited new sections of the app.",
      earned: false,
      icon: "compass",
    },
    {
      key: "sharer",
      name: "Sharer",
      description: "Shared a guide or achievement.",
      earned: false,
      icon: "share",
    },
    {
      key: "marathon",
      name: "Marathon",
      description: "Studied for 3+ hours in one day.",
      earned: false,
      icon: "clock",
    },
    {
      key: "night_owl",
      name: "Night Owl",
      description: "Studied after midnight.",
      earned: false,
      icon: "moon",
    },
    {
      key: "early_bird",
      name: "Early Bird",
      description: "Studied before 6 AM.",
      earned: false,
      icon: "sun",
    },

    {
      key: "mentor",
      name: "Mentor",
      description: "Guided another user.",
      earned: false,
      icon: "teacher",
    },
    {
      key: "quiz_master",
      name: "Quiz Master",
      description: "Scored 90%+ on a quiz.",
      earned: false,
      icon: "medal",
    },
    {
      key: "note_taker",
      name: "Note Taker",
      description: "Saved 10 notes.",
      earned: false,
      icon: "pencil",
    },
    {
      key: "flashcarder",
      name: "Flashcarder",
      description: "Reviewed 50 flashcards.",
      earned: false,
      icon: "cards",
    },
    {
      key: "consistent_30",
      name: "Consistent 30",
      description: "Completed 30 days of goals.",
      earned: false,
      icon: "calendar",
    },

    {
      key: "helper",
      name: "Community Helper",
      description: "Provided helpful answers.",
      earned: false,
      icon: "hands",
    },
    {
      key: "social_butterfly",
      name: "Social",
      description: "Participated in community events.",
      earned: false,
      icon: "users",
    },
    {
      key: "contributor",
      name: "Contributor",
      description: "Submitted a resource.",
      earned: false,
      icon: "upload",
    },
    {
      key: "challenger",
      name: "Challenger",
      description: "Completed a challenge.",
      earned: false,
      icon: "flag",
    },
    {
      key: "collector",
      name: "Collector",
      description: "Collected 5 badges.",
      earned: false,
      icon: "collection",
    },
  ];

  const [badges, setBadges] = useState(allBadges);

  const renderIcon = (badge) => {
    const base =
      "flex items-center justify-center w-10 h-10 rounded-full text-white text-xl";
    const variants = {
      star: "bg-gradient-to-br from-indigo-500 to-purple-500",
      trophy: "bg-gradient-to-br from-yellow-400 to-orange-500",
      rocket: "bg-gradient-to-br from-emerald-400 to-teal-500",
      heart: "bg-gradient-to-br from-pink-500 to-rose-500",
      book: "bg-gradient-to-br from-sky-500 to-blue-500",
    };
    const icons = {
      star: "★",
      trophy: "🏆",
      rocket: "🚀",
      heart: "❤",
      book: "📘",
    };
    const cls = `${base} ${variants[badge.icon] || variants.star}`;
    return <div className={cls}>{icons[badge.icon] || "★"}</div>;
  };
  return (
    <div className="w-full flex-2 flex flex-col items-center p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Badges</h2>

      {/* {loading && <p className="text-sm text-gray-500">Loading badges...</p>} */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
        {badges.map((badge) => {
          const earned = badge.earned;

          return (
            <div
              key={badge.key}
              className="relative group flex flex-col items-center"
            >
              <div
                className={`flex flex-col items-center justify-center w-28 h-28 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  earned
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-dashed border-gray-400 bg-transparent"
                }`}
              >
                {earned ? (
                  <>
                    {renderIcon(badge)}
                    <h3 className="mt-2 text-xs font-semibold text-gray-800 text-center">
                      {badge.name}
                    </h3>
                    <p className="mt-1 text-[10px] text-gray-500 text-center px-2">
                      {badge.description}
                    </p>
                  </>
                ) : (
                  // Locked badge: blank interior, name only in tooltip
                  <span className="sr-only">{badge.name}</span>
                )}
              </div>

              {/* Tooltip for locked badges */}
              {!earned && (
                <div className="pointer-events-none absolute -top-20 translate-y-full left-1/2 -translate-x-1/2 w-40 rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg z-10">
                  <p className="font-semibold">{badge.name}</p>
                  <p className="text-[10px] text-gray-200 mt-1">
                    {badge.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RenderBadgesTab;
