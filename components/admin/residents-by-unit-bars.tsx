"use client";

type UnitRow = { unit: string; count: number };

export function ResidentsByUnitBars({ rows }: { rows: UnitRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No residents listed yet.
      </p>
    );
  }

  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <ul className="space-y-3">
      {rows.map(({ unit, count }) => {
        const pct = Math.round((count / max) * 100);
        return (
          <li key={unit}>
            <div className="mb-1 flex min-w-0 items-center justify-between gap-2 text-xs">
              <span className="min-w-0 truncate font-medium text-zinc-700 dark:text-zinc-200">
                Unit {unit}
              </span>
              <span className="tabular-nums text-zinc-500 dark:text-zinc-400">
                {count} resident{count === 1 ? "" : "s"}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-blue-100/80 dark:bg-blue-950/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-500 transition-[width] duration-500 dark:from-blue-400 dark:to-sky-400"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
