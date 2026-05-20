import React from "react";
import { cn } from "@/lib/utils";

export type StatsBadgeItem = {
  id: number | string;
  icon?: React.ReactNode;
  iconClassName?: string;
  label: string;
  value: string | number;
  subValue?: string;
  positive?: boolean;
};

type StatsBadgeProps = {
  stats?: StatsBadgeItem[];
};

const StatsBadge = ({ stats = [] }: StatsBadgeProps) => {
  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-4
        w-full
      "
    >
      {safeStats.map((stat) => (
        <div
          key={stat.id}
          className="
            w-full
            min-w-0
            rounded-xl
            border
            border-white
            bg-neutral
            shadow-sm
            p-4
            flex
            items-center
            gap-4
            transition-all
            hover:scale-[1.02]
            hover:shadow-md
            cursor-pointer
          "
        >
          {stat.icon && (
            <div
              className={cn(
                `
                  flex
                  items-center
                  justify-center
                  shrink-0
                  rounded-xl
                  border-2
                  border-primary
                  p-3
                  text-lg
                  text-neutral-content
                `,
                stat.iconClassName,
              )}
            >
              {stat.icon}
            </div>
          )}

          <div className="flex flex-col min-w-0 flex-1">
            <span
              className="
                text-xs
                sm:text-sm
                font-medium
                truncate
                text-white
              "
            >
              {stat.label}
            </span>

            <span
              className="
                text-lg
                sm:text-xl
                lg:text-2xl
                font-bold
                wrap-break-words
                text-white
              "
            >
              {stat.value}
            </span>

            {stat.subValue && (
              <span
                className={cn(
                  `
                    text-xs
                    sm:text-sm
                    font-semibold
                    wrap-break-words
                  `,
                  stat.positive ? "text-success" : "text-error",
                )}
              >
                {stat.subValue}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBadge;
