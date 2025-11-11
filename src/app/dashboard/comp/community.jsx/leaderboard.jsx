"use client";
import React from "react";
import { Award, Users } from "lucide-react";

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
  const top = PLACEHOLDER_USERS.slice(0, 15);
  const topScore = top[0]?.score ?? 1;

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
        {top.map((u, idx) => {
          const rank = idx + 1;
          const pct = Math.round((u.score / topScore) * 100);
          const isMedal = rank <= 3;
          const medalColor =
            rank === 1
              ? "text-yellow-500"
              : rank === 2
              ? "text-gray-400"
              : "text-amber-600";
          return (
            <li key={u.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-700 font-bold">
                  {initials(u.name)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium truncate">{u.name}</div>
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
                    {u.handle}
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
                  {formatNumber(u.score)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
