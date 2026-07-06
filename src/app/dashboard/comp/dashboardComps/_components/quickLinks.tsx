"use client";

import Link from "next/link";
import { DASHBOARD_TABS } from "./tabStyles";
import { ArrowRight, Crown } from "lucide-react";

const quickLinks = [
  DASHBOARD_TABS.planner,
  DASHBOARD_TABS.lab,
  DASHBOARD_TABS.settings,
  DASHBOARD_TABS.admin,
];

type Props = {
  isAdmin: boolean;
};


const QuickLinks = ({ isAdmin} : Props) => {
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
        if (!isAdmin && link === DASHBOARD_TABS.admin) {
          return null;
        }

        const Icon = link.icon;

        return (
            <Link
              key={link.label}
              href={link.href}
              className={`group flex items-center justify-between rounded-xl px-2 py-2 border border-base-300 hover:border-neutral-content/30 hover:shadow-sm transition-all duration-200 ${link.bg}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Icon size={16} className={link.color} />
                </div>

                <div className="leading-tight">
                  <h3 className="text-sm font-semibold">{link.label}</h3>
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
