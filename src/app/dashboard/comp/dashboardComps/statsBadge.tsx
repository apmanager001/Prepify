import React from "react";
import { cn } from "@/lib/utils";

export type StatsBadgeTrend = "positive" | "negative" | "neutral";

export type StatsBadgeItem = {
  id: number | string;
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: StatsBadgeTrend;

  iconClassName?: string;
  iconContainerClassName?: string;
  divClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  subValueClassName?: string;
};

type StatsBadgeProps = {
  stats?: StatsBadgeItem[];
};

const trendStyles: Record<StatsBadgeTrend, string> = {
  positive: "text-success",
  negative: "text-error",
  neutral: "text-white",
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
          className={cn(
            `
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
            `,
            stat.divClassName,
          )}
        >
          {stat.icon && (
            <div
              className={cn(
                `
                  flex
                  items-center
                  justify-center
                  shrink-0
                  size-12
                  p-2
                  rounded-xl
                  border-primary
                  border-2
                  bg-black
                `,
                stat.iconContainerClassName,
              )}
            >
              <span
                className={cn(
                  `
                    flex
                    items-center
                    justify-center
                    text-lg
                    text-neutral-content
                  `,
                  stat.iconClassName,
                )}
              >
                {stat.icon}
              </span>
            </div>
          )}

          <div className="flex flex-col min-w-0 flex-1">
            <span
              className={cn(
                `
                  text-xs
                  sm:text-sm
                  font-medium
                  truncate
                  text-white
                `,
                stat.labelClassName,
              )}
            >
              {stat.label}
            </span>

            <span
              className={cn(
                `
                  text-lg
                  sm:text-xl
                  lg:text-2xl
                  font-bold
                  wrap-break-words
                  text-white
                `,
                stat.valueClassName,
              )}
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
                  trendStyles[stat.trend ?? "neutral"],
                  stat.subValueClassName,
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
