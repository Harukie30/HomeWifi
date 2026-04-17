"use client";

type RequestMixDonutProps = {
  pending: number;
  rejected: number;
  approved: number;
};

const COLORS = {
  pending: "rgb(245 158 11)",
  rejected: "rgb(239 68 68)",
  approved: "rgb(16 185 129)",
} as const;

export function RequestMixDonut({
  pending,
  rejected,
  approved,
}: RequestMixDonutProps) {
  const total = pending + rejected + approved;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <div className="relative size-44 rounded-full border-2 border-dashed border-zinc-200 bg-zinc-50/80 dark:border-zinc-700 dark:bg-zinc-900/50" />
        <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
          No registration data yet. Requests will appear here as residents
          submit forms.
        </p>
      </div>
    );
  }

  const p = pending / total;
  const r = rejected / total;
  const a = approved / total;

  const pEnd = p * 360;
  const rEnd = (p + r) * 360;
  const aEnd = 360;

  const background = `conic-gradient(
    ${COLORS.pending} 0deg ${pEnd}deg,
    ${COLORS.rejected} ${pEnd}deg ${rEnd}deg,
    ${COLORS.approved} ${rEnd}deg ${aEnd}deg
  )`;

  return (
    <div className="flex min-w-0 flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
      <div
        className="relative grid size-44 shrink-0 place-items-center"
        role="img"
        aria-label={`Request mix: ${pending} pending, ${rejected} rejected, ${approved} approved`}
      >
        <div
          className="col-start-1 row-start-1 size-full rounded-full shadow-inner shadow-zinc-900/10 dark:shadow-black/30"
          style={{ background }}
        />
        <div className="col-start-1 row-start-1 z-[1] size-[58%] rounded-full border border-white/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950" />
        <div className="col-start-1 row-start-1 z-[2] text-center text-[11px] font-medium leading-tight text-zinc-600 dark:text-zinc-300">
          {total}
          <br />
          requests
        </div>
      </div>

      <ul className="flex w-full min-w-0 max-w-xs flex-col gap-3 text-sm">
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: COLORS.pending }}
              aria-hidden
            />
            Pending
          </span>
          <span className="tabular-nums text-zinc-600 dark:text-zinc-300">
            {pending}{" "}
            <span className="text-zinc-400">
              ({Math.round(p * 1000) / 10}%)
            </span>
          </span>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: COLORS.rejected }}
              aria-hidden
            />
            Rejected
          </span>
          <span className="tabular-nums text-zinc-600 dark:text-zinc-300">
            {rejected}{" "}
            <span className="text-zinc-400">
              ({Math.round(r * 1000) / 10}%)
            </span>
          </span>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: COLORS.approved }}
              aria-hidden
            />
            Approved
          </span>
          <span className="tabular-nums text-zinc-600 dark:text-zinc-300">
            {approved}{" "}
            <span className="text-zinc-400">
              ({Math.round(a * 1000) / 10}%)
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
}
