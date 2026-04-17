"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

function safeAdminRedirect(path: string | null): string {
  if (
    path &&
    path.startsWith("/admin") &&
    !path.startsWith("/admin/login")
  ) {
    return path;
  }
  return "/admin";
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [backProgress, setBackProgress] = useState(10);

  function handleBackNavigation() {
    if (isNavigatingBack) return;

    setIsNavigatingBack(true);
    setBackProgress(10);

    const progressTimer = setInterval(() => {
      setBackProgress((current) => (current >= 92 ? current : current + 7));
    }, 120);

    setTimeout(() => {
      clearInterval(progressTimer);
      setBackProgress(100);
      router.push("/");
    }, 2500);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    setLoginProgress(12);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      const message = payload.error ?? "Login failed. Please try again.";
      setError(message);
      toast.error(message);
      setIsSubmitting(false);
      setLoginProgress(0);
      return;
    }

    setLoginProgress(100);
    toast.success("Signed in successfully.");
    const nextPath = safeAdminRedirect(searchParams.get("redirect"));
    window.setTimeout(() => {
      router.push(nextPath);
      router.refresh();
    }, 200);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-100 px-4 dark:bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute -left-20 -top-16 h-72 w-72 rounded-full bg-amber-400/25 blur-3xl dark:bg-amber-500/15" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="absolute left-4 top-4 z-10 w-full max-w-[220px] sm:left-6 sm:top-6">
        <Button
          type="button"
          variant="ghost"
          disabled={isNavigatingBack}
          onClick={handleBackNavigation}
          className="w-fit px-0 text-sm text-zinc-600 hover:text-foreground dark:text-zinc-400"
        >
          ← Back to resident page
        </Button>
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden border-zinc-200/80 bg-white/90 py-0 shadow-2xl shadow-zinc-900/10 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-black/30">
        <CardHeader className="space-y-2 border-b border-zinc-200 bg-gradient-to-r from-amber-50/80 to-transparent px-6 pb-5 pt-6 dark:border-zinc-800 dark:from-amber-500/10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
            Abella Home
          </p>
          <CardTitle className="text-2xl tracking-tight">Admin Login</CardTitle>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to review and manage resident registration requests.
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form className="space-y-5 pt-1" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="admin-email"
                className="text-xs uppercase tracking-wide text-zinc-500"
              >
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@abella.local"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-xs uppercase tracking-wide text-zinc-500"
              >
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </p>
            ) : null}
            {isSubmitting ? (
              <div className="space-y-1">
                <Progress value={loginProgress} className="h-2" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Signing in to dashboard...
                </p>
              </div>
            ) : null}
            <Button
              type="submit"
              className="w-full rounded-full bg-amber-500 text-black hover:bg-amber-600 hover:text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Image
        src="/wifi.png"
        alt="WiFi router illustration"
        width={480}
        height={480}
        priority
        sizes="(max-width: 640px) 96px, (max-width: 1024px) 144px, 220px"
        className="pointer-events-none absolute bottom-3 right-3 z-0 h-auto w-24 opacity-75 drop-shadow-lg dark:opacity-60 sm:bottom-6 sm:right-6 sm:w-36 lg:bottom-8 lg:right-8 lg:w-[320px]"
      />

      {isNavigatingBack ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]">
          <Card className="w-full max-w-sm py-0">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-lg">Returning to Resident Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-6 pb-6">
              <Progress value={backProgress} className="h-2" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Please wait while we prepare your resident portal...
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500">Loading…</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
