"use client";
import React from "react";
import { Award, Users as UserIcon } from "lucide-react";
import useLeaderboard from "./leaderboard.js";

function initials(name) {
  if (!name || typeof name !== "string") return "U";
  const words = name.trim().split(/\s+/);
  const chars = [];
  for (const w of words) {
    const m = w.match(/[A-Za-z0-9]/);
    if (m) {
      chars.push(m[0].toUpperCase());
    }
    if (chars.length === 2) break;
  }
  if (chars.length > 0) return chars.join("");
  const fallback = (name.match(/[A-Za-z0-9]/) || [])[0];
  return (fallback || "U").toUpperCase();
}

function formatNumber(n) {
  return n.toLocaleString();
}

export default function Leaderboard() {
  // Fetch top users from backend; fall back to placeholders while loading/error
  const query = useLeaderboard({
    page: 1,
    pageSize: 15,
  });

  // Defensive: in production builds, data might be the full query object
  let data = query.data;
  if (data && typeof data === "object" && "data" in data) {
    data = data.data;
  }

  // Normalize data: data might be the leaderboard array directly, or an object with leaderboard
  const leaderboard = Array.isArray(data) ? data : data?.leaderboard || [];
  const top = leaderboard.slice(0, 15);
  const topScore = React.useMemo(() => {
    const first = top[0];
    const candidate = Number(first?.score ?? first?.total ?? first?.coins ?? 0);
    return Math.max(Number.isFinite(candidate) ? candidate : 0, 1);
  }, [top]);

  const isEmpty = !query.isLoading && leaderboard.length === 0;
  return (
    <section className="p-4 bg-base-200 rounded-lg shadow-sm border border-base-content/10 customContainer pointer-events-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-md">
            <UserIcon className="text-indigo-600" size={20} />
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
        {query.isLoading ? (
          // simple skeleton rows while loading
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
        ) : isEmpty ? (
          <li className="py-4 text-sm text-gray-500">No leaderboard data</li>
        ) : (
          top.map((u, idx) => {
            // Defensive: if u is a query object, unwrap
            let user = u;
            if (user && typeof user === "object" && "data" in user) {
              user = user.data;
            }
            const rank = idx + 1;
            const uScore = Number(
              user?.score ?? user?.total ?? user?.coins ?? 0,
            );
            const pct = topScore
              ? Math.round(
                  ((Number.isFinite(uScore) ? uScore : 0) / topScore) * 100,
                )
              : 0;
            const isMedal = rank <= 3;
            const medalColor =
              rank === 1
                ? "text-yellow-500"
                : rank === 2
                  ? "text-gray-400"
                  : "text-amber-600";
            // Defensive coercions: ensure we render primitives, not objects
            const displayName =
              user && user.name
                ? typeof user.name === "string"
                  ? user.name
                  : JSON.stringify(user.name)
                : user && user.user && user.user.username
                  ? typeof user.user.username === "string"
                    ? user.user.username
                    : JSON.stringify(user.user.username)
                  : `User ${idx + 1}`;

            if (typeof displayName !== "string") {
              console.warn("Leaderboard: coerced non-string name", displayName);
            }

            const displayUsername =
              user && user.user && user.user.screenName
                ? typeof user.user.screenName === "string"
                  ? user.user.screenName
                  : JSON.stringify(user.user.screenName)
                : "";

            const displayTotal = (() => {
              const t = user?.total ?? user?.score ?? user?.coins ?? 0;
              const n = Number(t);
              if (Number.isNaN(n)) {
                console.warn("Leaderboard: coerced non-numeric total", t);
                return String(t ?? "0");
              }
              return formatNumber(n);
            })();

            return (
              <li key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {/* <div className="flex items-center justify-center w-10 h-10 rounded-full bg-info/10 border border-info text-info font-bold"> */}
                  <div className="btn  btn-circle btn-info btn-soft border-info text-info font-bold">
                    {(() => {
                      const possibleUsername =
                        (typeof user?.username === "string" && user.username) ||
                        (typeof user?.user?.username === "string" &&
                          user.user.username) ||
                        "";

                      if (possibleUsername.startsWith("\\google")) {
                        // Use only first word of nested screenName when account came from Google
                        const sn =
                          user?.user?.screenName ??
                          user?.screenName ??
                          displayName;
                        const firstWord =
                          typeof sn === "string" ? sn.split(/\s+/)[0] : sn;
                        return initials(firstWord);
                      }

                      return initials(
                        typeof user?.name === "string" && user?.name
                          ? user.name
                          : displayName,
                      );
                    })()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium truncate">
                        {displayUsername || displayName}
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
                      className="bg-neutral-content h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm font-semibold">
                    {displayTotal}
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
