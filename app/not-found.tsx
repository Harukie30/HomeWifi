import Link from "next/link";
import { Home, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white via-amber-50/40 to-zinc-50 px-6 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-gradient-to-br from-amber-400/30 via-orange-300/20 to-transparent blur-3xl dark:from-amber-500/20 dark:via-orange-500/10" />
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-400/25 via-cyan-300/20 to-transparent blur-3xl dark:from-sky-500/12 dark:via-cyan-500/10" />
      </div>

      <section className="relative z-10 w-full max-w-xl rounded-3xl border border-zinc-200/80 bg-white/70 p-8 text-center shadow-xl shadow-zinc-900/10 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-black/30">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10">
          <ShieldAlert
            className="size-7 text-amber-700 dark:text-amber-400"
            aria-hidden
          />
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber-700/90 dark:text-amber-400/90">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          The page you are trying to open does not exist or may have been moved.
          You can return to the WiFi portal or open the admin dashboard.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Button
            asChild
            className="h-10 min-w-36 rounded-full bg-amber-500 text-black hover:bg-amber-600 hover:text-white"
          >
            <Link href="/">
              <Home className="mr-1 size-4" aria-hidden />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-10 min-w-36 rounded-full">
            <Link href="/admin">Go to admin</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
