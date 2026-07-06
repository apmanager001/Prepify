import {
  Calendar,
  FlaskConical,
  Settings,
  Shield,
  LucideIcon,
} from "lucide-react";

export type DashboardTab = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  bg: string;
  color: string;
};

export const DASHBOARD_TABS: Record<string, DashboardTab> = {
  planner: {
    label: "Planner",
    description: "Tasks & Calendar",
    href: "/dashboard?tab=planner",
    icon: Calendar,
    bg: "bg-orange-500/15",
    color: "text-orange-500",
  },

  lab: {
    label: "Lab",
    description: "Notes & Timers",
    href: "/dashboard?tab=lab",
    icon: FlaskConical,
    bg: "bg-green-500/15",
    color: "text-green-500",
  },

  settings: {
    label: "Settings",
    description: "Preferences, Security, and Badges",
    href: "/dashboard?tab=settings",
    icon: Settings,
    bg: "bg-gray-500/15",
    color: "text-gray-500",
  },

  admin: {
    label: "Admin Panel",
    description: "Manage the platform",
    href: "/dashboard?tab=admin",
    icon: Shield,
    bg: "bg-red-500/15",
    color: "text-red-500",
  },
};
