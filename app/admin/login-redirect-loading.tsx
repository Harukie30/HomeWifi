"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LoginRedirectLoading() {
  const router = useRouter();
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((current) => (current >= 92 ? current : current + 7));
    }, 120);

    const redirectTimer = setTimeout(() => {
      setProgress(100);
      router.replace("/admin/login");
    }, 2500);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white via-amber-50/40 to-zinc-50 px-6 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-400/35 via-orange-300/25 to-transparent blur-3xl dark:from-amber-500/20 dark:via-orange-500/15" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-400/30 via-cyan-300/20 to-transparent blur-3xl dark:from-sky-500/15 dark:via-cyan-500/10" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute right-[12%] top-[20%] h-40 w-40 rounded-full border border-amber-500/20 dark:border-amber-400/15" />
        <div className="absolute right-[8%] top-[28%] h-24 w-24 rounded-full border border-sky-500/25 dark:border-sky-400/15" />
        <div className="absolute bottom-[18%] left-[10%] h-32 w-32 rotate-12 rounded-3xl border border-cyan-500/20 dark:border-cyan-400/12" />
        <div className="absolute -right-8 top-1/2 h-px w-48 rotate-45 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent dark:via-amber-500/25" />
        <div className="absolute bottom-1/4 left-1/4 h-px w-32 -rotate-12 bg-gradient-to-r from-transparent via-sky-400/35 to-transparent dark:via-sky-500/20" />
      </div>
      <Card className="relative z-10 w-full max-w-lg py-0">
        <CardHeader className="px-6 pt-6">
          <CardTitle>Redirecting to Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-6 pb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Please wait while we open the login page...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
