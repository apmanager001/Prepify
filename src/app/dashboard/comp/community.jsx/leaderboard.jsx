"use client";
import React from "react";
import { Award, Users } from "lucide-react";
import useLeaderboard from "./leaderboard.js";

const PLACEHOLDER_USERS = [
  { id: 1, name: "Ava Thompson", handle: "@ava", score: 12840 },
  { id: 2, name: "Liam Johnson", handle: "@liam", score: 11950 },
  { id: 3, name: "Olivia Martin", handle: "@olivia", score: 11320 },
  { id: 4, name: "Noah Brown", handle: "@noah", score: 9870 },
  { id: 5, name: "Emma Davis", handle: "@emma", score: 9520 },
  { id: 6, name: "Lucas Wilson", handle: "@lucas", score: 9025 },
  { id: 7, name: "Mia Moore", handle: "@mia", score: 8630 },
  { id: 8, name: "Ethan Taylor", handle: "@ethan", score: 8300 },
  { id: 9, name: "Sophia Anderson", handle: "@sophia", score: 7990 },
  { id: 10, name: "Logan Thomas", handle: "@logan", score: 7450 },
  { id: 11, name: "Isabella Jackson", handle: "@isabella", score: 7020 },
  { id: 12, name: "Mason White", handle: "@mason", score: 6805 },
  { id: 13, name: "Charlotte Harris", handle: "@charlotte", score: 6550 },
  { id: 14, name: "James Martin", handle: "@james", score: 6300 },
  { id: 15, name: "Amelia Clark", handle: "@amelia", score: 6020 },
];

function initials(name) {
  if (!name || typeof name !== "string") return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatNumber(n) {
  return n.toLocaleString();
}

export default function Leaderboard() {
  // Fetch top users from backend; fall back to placeholders while loading/error
  const { data, isLoading, isError } = useLeaderboard({
    page: 1,
    pageSize: 15,
  });

  // Normalize possible response shapes into an items array
  const normalizeItems = (d) => {
    if (!d) return null;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.items)) return d.items;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d.leaderboard)) return d.leaderboard;
    return null;
  };

  // Defensive: some callers or runtime mistakes may pass the whole query object
  // (contains keys like status, isLoading, data) accidentally as `data`.
  // Detect and unwrap it so we don't try to render the query object as JSX.
  let raw = data;
  if (
    raw &&
    typeof raw === "object" &&
    ("status" in raw || "isLoading" in raw) &&
    "data" in raw
  ) {
    console.warn(
      "Leaderboard: received full query object instead of data — unwrapping.",
      raw
    );
    raw = raw.data;
  }

  const items = normalizeItems(raw);
  const top = items.slice(0, 15);
  const topScore = Math.max(Number(top[0]?.score) || 0, 1); // avoid div-by-zero

  return (
    <section className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-md">
            <Users className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Leaderboard</h3>
            <div className="text-xs text-gray-500">
              Top learners by lifetime score
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">Top 15</div>
      </div>

      <ul className="divide-y">
        {isLoading
          ? // simple skeleton rows while loading
            Array.from({ length: 5 }).map((_, i) => (
              <li
                key={`skeleton-${i}`}
                className="py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                  </div>
                </div>

                <div className="w-48 md:w-64 flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-gray-200 h-2 rounded-full w-1/3 animate-pulse" />
                  </div>
                  <div className="w-20 text-right text-sm font-semibold">
                    <div className="h-4 bg-gray-200 rounded w-12 ml-auto animate-pulse" />
                  </div>
                </div>
              </li>
            ))
          : top?.map((u, idx) => {
              const rank = idx + 1;
              const pct = Math.round((u.score / topScore) * 100);
              const isMedal = rank <= 3;
              const medalColor =
                rank === 1
                  ? "text-yellow-500"
                  : rank === 2
                  ? "text-gray-400"
                  : "text-amber-600";
              // Defensive coercions: ensure we render primitives, not objects
              const displayName =
                u && u.name
                  ? typeof u.name === "string"
                    ? u.name
                    : JSON.stringify(u.name)
                  : u && u.user && u.user.username
                  ? typeof u.user.username === "string"
                    ? u.user.username
                    : JSON.stringify(u.user.username)
                  : `User ${idx + 1}`;

              if (typeof displayName !== "string") {
                console.warn(
                  "Leaderboard: coerced non-string name",
                  displayName
                );
              }

              const displayUsername =
                u && u.user && u.user.username
                  ? typeof u.user.username === "string"
                    ? u.user.username
                    : JSON.stringify(u.user.username)
                  : "";

              const displayTotal = (() => {
                const t = u?.total ?? u?.score ?? u?.points ?? 0;
                const n = Number(t);
                if (Number.isNaN(n)) {
                  console.warn("Leaderboard: coerced non-numeric total", t);
                  return String(t ?? "0");
                }
                return formatNumber(n);
              })();

              return (
                <li
                  key={u.userId ?? u.id ?? u.user?.id ?? idx}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-700 font-bold">
                      {typeof (u?.name ?? displayName) === "string"
                        ? initials(String(u?.name ?? displayName))
                        : "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium truncate">
                          {displayName}
                        </div>
                        {isMedal && (
                          <span
                            className={`inline-flex items-center text-xs ${medalColor}`}
                            title={`Rank ${rank}`}
                          >
                            <Award size={14} />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {displayUsername}
                      </div>
                    </div>
                  </div>

                  <div className="w-48 md:w-64 flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-sm font-semibold">
                      {displayTotal}
                    </div>
                  </div>
                </li>
              );
            })}
      </ul>
    </section>
  );
}
