"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  UserX,
  UserCheck,
  Users,
  ChartPie,
  BarChart3,
} from "lucide-react";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { AdminLoadingDialog } from "@/components/admin/admin-loading-dialog";
import { RequestMixDonut } from "@/components/admin/request-mix-donut";
import { ResidentsByUnitBars } from "@/components/admin/residents-by-unit-bars";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type AdminStats = {
  pending: number;
  rejected: number;
  approved: number;
  activeResidents: number;
  totalRequests: number;
  residentsByUnit: { unit: string; count: number }[];
  resolutionRatePercent: number | null;
};

function pctPart(n: number, total: number): string {
  if (total <= 0) return "0";
  return (Math.round((n / total) * 1000) / 10).toString();
}

export function AdminOverviewPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStats() {
    setIsLoading(true);
    setError("");
    const response = await fetch("/api/admin/stats", { cache: "no-store" });

    if (response.status === 401) {
      setIsLoading(false);
      router.push("/admin/login");
      return;
    }

    if (!response.ok) {
      setError("Could not load dashboard stats.");
      toast.error("Could not load dashboard stats.");
      setIsLoading(false);
      return;
    }

    const payload = (await response.json()) as AdminStats;
    setStats(payload);
    setIsLoading(false);
  }

  async function handleLogout() {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (response.ok) {
      toast.success("You have been logged out.");
    } else {
      toast.error("Could not log out. Please try again.");
    }
    window.setTimeout(() => {
      router.push("/admin/login");
      router.refresh();
    }, 200);
  }

  useEffect(() => {
    loadStats();
  }, []);

  const cards = useMemo(() => {
    if (!stats) return [];
    const t = stats.totalRequests;
    type LucideIcon = typeof ClipboardList;
    return [
      {
        title: "Pending review",
        description: "Registration requests awaiting action",
        value: stats.pending,
        footnote:
          t > 0 ? `${pctPart(stats.pending, t)}% of all requests` : "—",
        icon: ClipboardList,
        accent:
          "border-amber-200/80 bg-amber-50/90 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/35 dark:text-amber-100",
      },
      {
        title: "Rejected",
        description: "Requests declined by admin",
        value: stats.rejected,
        footnote:
          t > 0 ? `${pctPart(stats.rejected, t)}% of all requests` : "—",
        icon: UserX,
        accent:
          "border-red-200/80 bg-red-50/90 text-red-900 dark:border-red-900/40 dark:bg-red-950/35 dark:text-red-100",
      },
      {
        title: "Approved",
        description: "Registrations approved (historical)",
        value: stats.approved,
        footnote:
          t > 0 ? `${pctPart(stats.approved, t)}% of all requests` : "—",
        icon: UserCheck,
        accent:
          "border-emerald-200/80 bg-emerald-50/90 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/35 dark:text-emerald-100",
      },
      {
        title: "Active residents",
        description: "Listed on the resident WiFi portal",
        value: stats.activeResidents,
        footnote:
          stats.totalRequests > 0
            ? `${stats.activeResidents} on portal`
            : "Portal list",
        icon: Users,
        accent:
          "border-blue-200/80 bg-blue-50/90 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/35 dark:text-blue-100",
      },
    ] as {
      title: string;
      description: string;
      value: number;
      footnote: string;
      icon: LucideIcon;
      accent: string;
    }[];
  }, [stats]);

  const decidedTotal = stats
    ? stats.approved + stats.rejected
    : 0;

  return (
    <AdminDashboardShell title="Overview" onLogout={handleLogout}>
      <AdminLoadingDialog
        open={isLoading}
        title="Loading dashboard"
        description="Fetching registration stats…"
      />
      <div className="space-y-5 sm:space-y-6">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Registration pipeline, request mix, and how residents are distributed
          across units.
        </p>

        {isLoading ? (
          <div className="space-y-5 sm:space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="border-blue-200/60 bg-white/80 py-0 dark:border-blue-900/50 dark:bg-zinc-900/70"
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2 pt-4 sm:pt-5">
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-full max-w-[180px]" />
                    </div>
                    <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                  </CardHeader>
                  <CardContent className="space-y-2 pb-5 pt-0">
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-blue-200/60 bg-white/80 py-0 dark:border-blue-900/50 dark:bg-zinc-900/70">
                <CardHeader className="px-4 pt-4 sm:px-5 sm:pt-5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="mt-2 h-3 w-full max-w-[280px]" />
                </CardHeader>
                <CardContent className="flex min-h-[200px] items-center justify-center px-4 pb-5 sm:px-5 sm:pb-6">
                  <Skeleton className="size-44 shrink-0 rounded-full" />
                </CardContent>
              </Card>
              <Card className="border-blue-200/60 bg-white/80 py-0 dark:border-blue-900/50 dark:bg-zinc-900/70">
                <CardHeader className="px-4 pt-4 sm:px-5 sm:pt-5">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="mt-2 h-3 w-full max-w-[260px]" />
                </CardHeader>
                <CardContent className="space-y-4 px-4 pb-5 sm:px-5 sm:pb-6">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="flex justify-between gap-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-2.5 w-full rounded-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-blue-200/60 bg-white/70 py-0 dark:border-blue-900/50 dark:bg-zinc-900/60">
                <CardHeader className="px-4 pt-4 sm:px-5 sm:pt-5">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="mt-2 h-3 w-full max-w-[220px]" />
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
              <Card className="border-blue-200/60 bg-white/70 py-0 dark:border-blue-900/50 dark:bg-zinc-900/60">
                <CardHeader className="px-4 pt-4 sm:px-5 sm:pt-5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="mt-2 h-3 w-full max-w-[240px]" />
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => (
                <Card
                  key={card.title}
                  className="flex h-full min-h-[188px] flex-col border-blue-200/70 bg-white/85 py-0 shadow-sm shadow-blue-900/5 backdrop-blur-sm dark:border-blue-900/45 dark:bg-zinc-900/75 dark:shadow-blue-950/20"
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 px-4 pb-2 pt-4 sm:px-5 sm:pt-5">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <CardTitle className="text-[15px] font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
                        {card.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {card.description}
                      </CardDescription>
                    </div>
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${card.accent}`}
                    >
                      <card.icon className="size-5" aria-hidden />
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-1.5 px-4 pb-5 pt-1 sm:px-5">
                    <p className="text-3xl font-semibold tabular-nums leading-none tracking-tight text-zinc-900 dark:text-zinc-50">
                      {card.value}
                    </p>
                    <p className="text-xs font-medium leading-snug text-zinc-500 dark:text-zinc-400">
                      {card.footnote}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {stats ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-blue-200/70 bg-white/80 py-0 dark:border-blue-900/45 dark:bg-zinc-900/70">
                  <CardHeader className="px-4 pt-4 sm:px-5 sm:pt-5">
                    <div className="flex min-w-0 items-center gap-2">
                      <ChartPie className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <CardTitle className="min-w-0 text-base">
                        Request mix (pie)
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Share of each outcome among all registration requests.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="min-w-0 px-4 pb-5 sm:px-5 sm:pb-6">
                    <RequestMixDonut
                      pending={stats.pending}
                      rejected={stats.rejected}
                      approved={stats.approved}
                    />
                  </CardContent>
                </Card>

                <Card className="border-blue-200/70 bg-white/80 py-0 dark:border-blue-900/45 dark:bg-zinc-900/70">
                  <CardHeader className="px-4 pt-4 sm:px-5 sm:pt-5">
                    <div className="flex min-w-0 items-center gap-2">
                      <BarChart3 className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <CardTitle className="min-w-0 text-base">
                        Usage by unit
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Residents with WiFi access per apartment unit (relative
                      bar length).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="min-w-0 px-4 pb-5 sm:px-5 sm:pb-6">
                    <ResidentsByUnitBars rows={stats.residentsByUnit} />
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {stats ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-blue-200/70 bg-white/70 py-0 dark:border-blue-900/45 dark:bg-zinc-900/60">
                  <CardHeader className="px-4 pt-4 sm:px-5 sm:pt-5">
                    <CardTitle className="text-base">All-time requests</CardTitle>
                    <CardDescription>
                      Every submission in this session (all statuses).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
                    <p className="text-2xl font-semibold tabular-nums text-blue-900 dark:text-blue-200">
                      {stats.totalRequests}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/70 bg-white/70 py-0 dark:border-blue-900/45 dark:bg-zinc-900/60">
                  <CardHeader className="px-4 pt-4 sm:px-5 sm:pt-5">
                    <CardTitle className="text-base">
                      Decision quality
                    </CardTitle>
                    <CardDescription>
                      Of requests you already approved or rejected, what share
                      were approved?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
                    {decidedTotal === 0 ? (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        No decided requests yet — only pending items.
                      </p>
                    ) : (
                      <p className="text-2xl font-semibold tabular-nums text-emerald-800 dark:text-emerald-300">
                        {stats.resolutionRatePercent ?? 0}%
                        <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                          approval rate
                        </span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </>
        )}
      </div>
    </AdminDashboardShell>
  );
}
