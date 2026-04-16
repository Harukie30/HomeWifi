"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

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
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle ?? "Admin Dashboard"}
            </p>
            <h1 className="text-3xl font-semibold">{title}</h1>
          </div>

          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-56 shrink-0 lg:block">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Dashboard
            </p>
            <nav className="mt-3 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin">Pending Requests</Link>
              </Button>
            </nav>
          </aside>

          <section className="flex-1">{children}</section>
        </div>
      </main>
    </div>
  );
}

