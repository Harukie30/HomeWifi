"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function AdminDashboardBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Soft blue wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/70 to-sky-100/50 dark:from-zinc-950 dark:via-blue-950/40 dark:to-slate-950" />
      {/* Large orbs — blue family only */}
      <div className="absolute -right-20 -top-28 h-[22rem] w-[22rem] rounded-full bg-gradient-to-br from-blue-400/30 via-sky-400/20 to-transparent blur-3xl dark:from-blue-500/25 dark:via-blue-600/15" />
      <div className="absolute -bottom-36 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-sky-300/25 via-blue-400/20 to-transparent blur-3xl dark:from-blue-600/20 dark:via-sky-900/25" />
      <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl dark:bg-blue-500/10" />
      {/* Geometric accents */}
      <div className="absolute right-[12%] top-[14%] h-36 w-36 rounded-full border border-blue-400/25 dark:border-blue-500/20" />
      <div className="absolute right-[8%] top-[22%] h-20 w-20 rounded-full border border-sky-400/30 dark:border-sky-500/15" />
      <div className="absolute bottom-[12%] left-[8%] h-28 w-28 rotate-12 rounded-3xl border border-blue-300/25 dark:border-blue-600/20" />
      <div className="absolute -right-6 top-1/2 h-px w-40 rotate-45 bg-gradient-to-r from-transparent via-blue-400/35 to-transparent dark:via-blue-500/25" />
      <div className="absolute bottom-1/4 left-1/4 h-px w-32 -rotate-12 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent dark:via-sky-600/20" />
    </div>
  );
}

export function AdminDashboardShell({
  children,
  title,
  subtitle,
  onLogout,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const isOverviewActive =
    pathname === "/admin" || pathname === "/admin/";
  const isPendingActive = pathname.startsWith("/admin/pending");
  const isRejectedActive = pathname.startsWith("/admin/rejected");
  const isWifiUsersActive = pathname.startsWith("/admin/wifi-users");

  const surfaceCard =
    "rounded-2xl border border-blue-200/80 bg-white/75 shadow-sm shadow-blue-900/5 backdrop-blur-md dark:border-blue-900/45 dark:bg-zinc-900/65 dark:shadow-blue-950/20";

  return (
    <div className="relative flex min-h-screen min-h-[100dvh] flex-col overflow-x-hidden bg-zinc-100 dark:bg-zinc-950">
      <AdminDashboardBackdrop />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
          {/* Top bar */}
          <header
            className={cn(
              "mb-5 flex flex-col gap-3 sm:mb-7 sm:gap-4 md:mb-8 sm:flex-row sm:items-start sm:justify-between",
              surfaceCard,
              "p-4 sm:p-5 md:p-6"
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-blue-600/90 sm:text-sm dark:text-blue-400/90">
                {subtitle ?? "Admin Dashboard"}
              </p>
              <h1 className="mt-1 break-words text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl md:text-3xl">
                {title}
              </h1>
            </div>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full cursor-pointer border-red-400 bg-red-600 text-white shadow-sm sm:w-auto sm:shrink-0",
                "hover:bg-red-700 hover:text-white",
                "dark:border-red-800 dark:bg-red-600 dark:hover:bg-red-700"
              )}
              onClick={onLogout}
            >
              Logout
            </Button>
          </header>

          {/* Mobile tab bar */}
          <nav
            className={cn("mb-5 sm:mb-6 lg:hidden", surfaceCard, "p-1.5 sm:p-2")}
            aria-label="Admin sections"
          >
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5 sm:grid-cols-4">
              <Button
                variant={isOverviewActive ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "min-h-[2.5rem] min-w-0 border-blue-200/70 px-1.5 text-[11px] leading-tight sm:px-2 sm:text-xs dark:border-blue-800/60",
                  !isOverviewActive &&
                    "bg-white/60 text-blue-900 hover:bg-blue-50/80 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:bg-blue-950/40"
                )}
                asChild
              >
                <Link href="/admin">Overview</Link>
              </Button>
              <Button
                variant={isPendingActive ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "min-h-[2.5rem] min-w-0 border-blue-200/70 px-1.5 text-[11px] leading-tight sm:px-2 sm:text-xs dark:border-blue-800/60",
                  !isPendingActive &&
                    "bg-white/60 text-blue-900 hover:bg-blue-50/80 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:bg-blue-950/40"
                )}
                asChild
              >
                <Link href="/admin/pending">Pending</Link>
              </Button>
              <Button
                variant={isRejectedActive ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "min-h-[2.5rem] min-w-0 border-blue-200/70 px-1.5 text-[11px] leading-tight sm:px-2 sm:text-xs dark:border-blue-800/60",
                  !isRejectedActive &&
                    "bg-white/60 text-blue-900 hover:bg-blue-50/80 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:bg-blue-950/40"
                )}
                asChild
              >
                <Link href="/admin/rejected">Rejected</Link>
              </Button>
              <Button
                variant={isWifiUsersActive ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "min-h-[2.5rem] min-w-0 border-blue-200/70 px-1.5 text-[11px] leading-tight sm:px-2 sm:text-xs dark:border-blue-800/60",
                  !isWifiUsersActive &&
                    "bg-white/60 text-blue-900 hover:bg-blue-50/80 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:bg-blue-950/40"
                )}
                asChild
              >
                <Link href="/admin/wifi-users">WiFi users</Link>
              </Button>
            </div>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            {/* Desktop sidebar */}
            <aside
              className={cn(
                "hidden w-56 shrink-0 lg:block",
                surfaceCard,
                "self-start p-4"
              )}
            >
              <div className="mb-3 h-px w-full bg-gradient-to-r from-blue-400/40 via-sky-400/30 to-transparent dark:from-blue-500/30 dark:via-blue-600/20" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600/80 dark:text-blue-400/80">
                Dashboard
              </p>
              <nav className="mt-4 space-y-1.5">
                <Button
                  variant={isOverviewActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    !isOverviewActive && "font-normal text-zinc-700 hover:bg-blue-50/90 dark:text-zinc-300 dark:hover:bg-blue-950/35",
                    isOverviewActive &&
                      "bg-blue-100/90 text-blue-950 dark:bg-blue-950/50 dark:text-blue-50"
                  )}
                  asChild
                >
                  <Link href="/admin">Overview</Link>
                </Button>
                <Button
                  variant={isPendingActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    !isPendingActive && "font-normal text-zinc-700 hover:bg-blue-50/90 dark:text-zinc-300 dark:hover:bg-blue-950/35",
                    isPendingActive &&
                      "bg-blue-100/90 text-blue-950 dark:bg-blue-950/50 dark:text-blue-50"
                  )}
                  asChild
                >
                  <Link href="/admin/pending">Pending requests</Link>
                </Button>
                <Button
                  variant={isRejectedActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    !isRejectedActive && "font-normal text-zinc-700 hover:bg-blue-50/90 dark:text-zinc-300 dark:hover:bg-blue-950/35",
                    isRejectedActive &&
                      "bg-blue-100/90 text-blue-950 dark:bg-blue-950/50 dark:text-blue-50"
                  )}
                  asChild
                >
                  <Link href="/admin/rejected">Rejected users</Link>
                </Button>
                <Button
                  variant={isWifiUsersActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    !isWifiUsersActive && "font-normal text-zinc-700 hover:bg-blue-50/90 dark:text-zinc-300 dark:hover:bg-blue-950/35",
                    isWifiUsersActive &&
                      "bg-blue-100/90 text-blue-950 dark:bg-blue-950/50 dark:text-blue-50"
                  )}
                  asChild
                >
                  <Link href="/admin/wifi-users">WiFi users</Link>
                </Button>
              </nav>
            </aside>

            <section className="min-w-0 flex-1">{children}</section>
          </div>
        </main>

        <footer className="relative z-10 mt-auto border-t border-blue-200/60 bg-white/55 backdrop-blur-md dark:border-blue-950/80 dark:bg-zinc-950/70">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-3 py-4 sm:flex-row sm:px-4 sm:py-5 md:px-6">
            <p className="text-center text-xs text-blue-900/70 dark:text-blue-300/70">
              Abella Home WiFi — Admin portal
            </p>
            <div className="flex items-center gap-4 text-xs text-blue-800/60 dark:text-blue-400/60">
              <Link
                href="/"
                className="font-medium underline-offset-4 hover:text-blue-700 hover:underline dark:hover:text-blue-300"
              >
                Resident portal
              </Link>
              <span className="hidden text-blue-300/50 sm:inline dark:text-blue-700/50">
                |
              </span>
              <span className="text-blue-800/50 dark:text-blue-500/50">
                © {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

