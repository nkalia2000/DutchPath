"use client";

import { useMemo } from "react";
import type { DailyActivity } from "@/lib/supabase/types";

interface Props {
  activity: DailyActivity[];
}

const WEEKS = 12;
const DAYS = 7;

function getIntensity(xp: number): number {
  if (xp === 0) return 0;
  if (xp < 20) return 1;
  if (xp < 50) return 2;
  if (xp < 100) return 3;
  return 4;
}

const INTENSITY_COLORS = [
  "bg-[var(--border)] opacity-50",      // 0 — empty
  "bg-primary opacity-30",               // 1 — light
  "bg-primary opacity-50",               // 2 — medium
  "bg-primary opacity-75",               // 3 — high
  "bg-primary opacity-100",              // 4 — max
];

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function ActivityHeatmap({ activity }: Props) {
  const { grid, monthLabels } = useMemo(() => {
    const activityMap = new Map<string, number>();
    activity.forEach((a) => activityMap.set(a.date, a.xp_earned));

    const today = new Date();
    // Align to most recent Sunday
    const dayOfWeek = today.getDay(); // 0=Sun
    const mostRecentSunday = new Date(today);
    mostRecentSunday.setDate(today.getDate() - dayOfWeek);

    const cells: { date: string; xp: number; intensity: number }[][] = [];
    const months: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;

    for (let w = WEEKS - 1; w >= 0; w--) {
      const week: typeof cells[0] = [];
      for (let d = 0; d < DAYS; d++) {
        const date = new Date(mostRecentSunday);
        date.setDate(mostRecentSunday.getDate() - w * 7 - (DAYS - 1 - d));
        const dateStr = date.toISOString().split("T")[0];
        const xp = activityMap.get(dateStr) ?? 0;
        week.push({ date: dateStr, xp, intensity: getIntensity(xp) });

        if (d === 0) {
          const month = date.getMonth();
          if (month !== lastMonth) {
            months.push({ label: MONTH_NAMES[month], colIndex: WEEKS - 1 - w });
            lastMonth = month;
          }
        }
      }
      cells.push(week);
    }

    return { grid: cells, monthLabels: months };
  }, [activity]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Month labels */}
        <div className="flex mb-1 pl-7">
          {Array.from({ length: WEEKS }).map((_, w) => {
            const month = monthLabels.find((m) => m.colIndex === w);
            return (
              <div key={w} className="w-4 mr-0.5 text-[9px] text-[var(--muted)]">
                {month?.label ?? ""}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1">
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="w-6 h-3.5 text-[9px] text-[var(--muted)] flex items-center justify-end pr-1">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((cell) => (
                <div
                  key={cell.date}
                  className={`w-3.5 h-3.5 rounded-sm transition-opacity ${INTENSITY_COLORS[cell.intensity]}`}
                  title={cell.xp > 0 ? `${cell.date}: ${cell.xp} XP` : cell.date}
                  role="img"
                  aria-label={cell.xp > 0 ? `${cell.date}: ${cell.xp} XP earned` : `${cell.date}: no activity`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-2 justify-end">
          <span className="text-[9px] text-[var(--muted)]">Less</span>
          {INTENSITY_COLORS.map((cls, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} aria-hidden="true" />
          ))}
          <span className="text-[9px] text-[var(--muted)]">More</span>
        </div>
      </div>
    </div>
  );
}
