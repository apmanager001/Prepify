"use client";

import Link from "next/link";
import {
  CheckSquare,
  NotebookPen,
  Calendar,
  UsersRound,
  Settings,
  ArrowRight,
  Crown,
} from "lucide-react";

const quickLinks = [
  {
    title: "Notes",
    description: "Notes",
    href: "/dashboard?tab=notes",
    icon: NotebookPen,
    bg: "bg-yellow-500/15",
    color: "text-yellow-500",
  },
  {
    title: "To-Do",
    description: "Tasks",
    href: "/dashboard?tab=todo",
    icon: CheckSquare,
    bg: "bg-orange-500/15",
    color: "text-orange-500",
  },
  {
    title: "Calendar",
    description: "Schedule",
    href: "/dashboard?tab=calendar",
    icon: Calendar,
    bg: "bg-purple-500/15",
    color: "text-purple-500",
  },
  {
    title: "Community",
    description: "Social",
    href: "/dashboard?tab=community",
    icon: UsersRound,
    bg: "bg-green-500/15",
    color: "text-green-500",
  },
  {
    title: "Settings",
    description: "Settings",
    href: "/dashboard?tab=settings",
    icon: Settings,
    bg: "bg-gray-500/15",
    color: "text-gray-600",
  },
];

const QuickLinks = () => {
  return (
    <div className="h-full p-4 flex flex-col gap-4 bg-base-100 rounded-lg shadow-sm w-full border border-base-content/20  duration-200 hover:shadow-md transition-shadow">
      <div className="border-b border-base-content/20 p-2">
        <h2 className="text-lg font-bold uppercase tracking-wide ">
          Quick Links
        </h2>
        <p className="text-xs text-gray-500">YOUR UNIVERSE, SIMPLIFIED</p>
      </div>

      <div className="flex flex-col gap-2 border-b border-base-content/20 p-2">
        {quickLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.title}
              href={link.href}
              className={`group flex items-center justify-between rounded-xl px-2 py-2 border border-base-300 hover:border-neutral-content/30 hover:shadow-sm transition-all duration-200 ${link.bg}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Icon size={16} className={link.color} />
                </div>

                <div className="leading-tight">
                  <h3 className="text-sm font-semibold">{link.title}</h3>
                  <p className="text-xs text-gray-500">{link.description}</p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>
      {/* ROW 3 */}
      <div className="mt-auto flex items-center gap-3 rounded-lg p-3 bg-base-200">
        <Crown size={18} className="text-warning shrink-0" />

        <div className="flex flex-col leading-tight">
          <p className="text-xs font-semibold">Earn. Learn. Level Up.</p>

          <p className="text-[11px] text-gray-500">
            Use your points wisely and stay consistent
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
