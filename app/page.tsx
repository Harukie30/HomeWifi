"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Resident } from "@/lib/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  RegisterResidentModal,
  type RegisterResidentFormData,
} from "@/components/register-resident-modal";

function HeroShapes() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Soft gradient orbs */}
      <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-400/35 via-orange-300/25 to-transparent blur-3xl dark:from-amber-500/20 dark:via-orange-500/15" />
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-400/30 via-cyan-300/20 to-transparent blur-3xl dark:from-sky-500/15 dark:via-cyan-500/10" />
      <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/10" />
      {/* Geometric rings */}
      <div className="absolute right-[12%] top-[20%] h-40 w-40 rounded-full border border-amber-500/20 dark:border-amber-400/15" />
      <div className="absolute right-[8%] top-[28%] h-24 w-24 rounded-full border border-sky-500/25 dark:border-sky-400/15" />
      <div className="absolute bottom-[18%] left-[10%] h-32 w-32 rotate-12 rounded-3xl border border-cyan-500/20 dark:border-cyan-400/12" />
      {/* Diagonal accent */}
      <div className="absolute -right-8 top-1/2 h-px w-48 rotate-45 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent dark:via-amber-500/25" />
      <div className="absolute bottom-1/4 left-1/4 h-px w-32 -rotate-12 bg-gradient-to-r from-transparent via-sky-400/35 to-transparent dark:via-sky-500/20" />
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingValue, setLoadingValue] = useState(10);
  const [hasEntered, setHasEntered] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoadingResidents, setIsLoadingResidents] = useState(true);
  const [requestSubmittedMessage, setRequestSubmittedMessage] = useState("");
  const hasResidents = residents.length > 0;

  async function fetchResidents() {
    try {
      const response = await fetch("/api/residents", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as { residents: Resident[] };
      setResidents(payload.residents);
    } finally {
      setIsLoadingResidents(false);
    }
  }

  async function handleRegisterSubmit(
    data: RegisterResidentFormData
  ): Promise<boolean> {
    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return false;
    }

    setRequestSubmittedMessage(
      "Your registration request has been submitted. Please wait for approval."
    );
    return true;
  }

  useEffect(() => {
    if (!isLoading) return;

    const progressTimer = setInterval(() => {
      setLoadingValue((current) => (current >= 92 ? current : current + 6));
    }, 120);

    const doneTimer = setTimeout(() => {
      setLoadingValue(100);
      setIsLoading(false);
      setHasEntered(true);
    }, 1700);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!hasEntered) return;
    fetchResidents();
    const intervalId = setInterval(() => {
      fetchResidents();
    }, 10000);
    return () => clearInterval(intervalId);
  }, [hasEntered]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white via-amber-50/40 to-zinc-50 px-6 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
        <HeroShapes />
        <section className="relative z-10 mx-auto w-full max-w-xl rounded-3xl border border-zinc-200/80 bg-white/70 p-8 shadow-xl shadow-zinc-900/10 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-black/30">
          <div className="mx-auto mb-6 flex h-16 w-20 items-end justify-center gap-1">
            <span className="h-4 w-1.5 animate-pulse rounded-full bg-amber-500 [animation-delay:0ms]" />
            <span className="h-7 w-1.5 animate-pulse rounded-full bg-amber-500/85 [animation-delay:140ms]" />
            <span className="h-10 w-1.5 animate-pulse rounded-full bg-amber-500/75 [animation-delay:280ms]" />
            <span className="h-7 w-1.5 animate-pulse rounded-full bg-amber-500/85 [animation-delay:420ms]" />
            <span className="h-4 w-1.5 animate-pulse rounded-full bg-amber-500 [animation-delay:560ms]" />
          </div>
          <h2 className="text-center text-xl font-semibold tracking-tight text-foreground">
            Connecting to Abella Home WiFi
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Setting up your home WiFi portal...
          </p>
          <Progress value={loadingValue} className="mt-6 h-2" />
        </section>
      </div>
    );
  }

  if (!hasEntered) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white via-amber-50/40 to-zinc-50 px-6 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
        <HeroShapes />
        <Image
          src="/rss.png"
          alt="WiFi signal icon"
          width={512}
          height={512}
          priority
          sizes="(max-width: 640px) 72px, (max-width: 1024px) 110px, 150px"
          className="pointer-events-none absolute left-3 top-3 z-0 h-auto w-18 opacity-70 dark:opacity-50 sm:left-6 sm:top-6 sm:w-24 lg:left-10 lg:top-10 lg:w-[220px]"
        />
        <Image
          src="/wifi.png"
          alt="WiFi router icon"
          width={512}
          height={512}
          priority
          sizes="(max-width: 640px) 88px, (max-width: 1024px) 130px, 190px"
          className="pointer-events-none absolute bottom-3 right-3 z-0 h-auto w-22 opacity-80 drop-shadow-lg dark:opacity-60 sm:bottom-6 sm:right-6 sm:w-32 lg:bottom-10 lg:right-10 lg:w-[290px]"
        />
        <section className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl border border-zinc-200/80 bg-white/70 p-8 text-center shadow-xl shadow-zinc-900/10 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-black/30">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700/90 dark:text-amber-400/90">
            Abella Home
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Welcome to Abella Home Apartment WiFi
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Check your building WiFi access and submit your registration request.
          </p>
          <Button
            size="lg"
            className="mt-8 h-12 min-w-40 cursor-pointer bg-amber-500 hover:bg-amber-600 hover:text-white text-black rounded-full px-8 text-base"
            onClick={() => {
              setLoadingValue(10);
              setIsLoading(true);
            }}
          >
            Enter
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-100/80 dark:bg-zinc-950">
      {/* Cover / welcome hero */}
      <section
        className="relative border-b border-zinc-200/80 bg-gradient-to-b from-white via-amber-50/40 to-zinc-50 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black"
        aria-labelledby="welcome-heading"
      >
        <HeroShapes />
        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-14 pt-12 sm:pb-20 sm:pt-16">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700/90 dark:text-amber-400/90">
            Abella Home
          </p>
          <h1
            id="welcome-heading"
            className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl sm:leading-tight"
          >
            Welcome to the Abella Home WiFi Portal
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Review approved residents and submit your WiFi registration request.
          </p>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10 sm:py-12">
        <header className="space-y-1 border-l-4 border-amber-500/70 pl-4 dark:border-amber-500/50">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Resident Portal
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            WiFi Access Overview
          </h2>
          <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
            The list below shows residents who are already approved for this
            building's WiFi access.
          </p>
        </header>

        <section
          className="rounded-2xl border border-zinc-200/90 bg-white/90 shadow-sm ring-1 ring-zinc-200/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:ring-zinc-800/80"
          aria-labelledby="residents-summary"
        >
          <Card className="border-none bg-transparent py-0 ring-0 shadow-none">
            <CardHeader className="px-6 pt-6">
              <CardTitle id="residents-summary" className="text-lg font-medium">
                Approved residents
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                These residents already have approved WiFi access. If you are
                not listed yet, use Register to submit a request.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6" />
          </Card>
        </section>

        <section className="space-y-3" aria-labelledby="residents-table-heading">
          <h2
            id="residents-table-heading"
            className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
          >
            Approved users
          </h2>
          <Card className="overflow-hidden rounded-xl border border-zinc-200/90 bg-white/90 py-0 shadow-sm ring-1 ring-zinc-200/40 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:ring-zinc-800/60">
            <Table className="min-w-[520px] text-left text-sm">
              <TableHeader>
                <TableRow className="bg-zinc-50/90 hover:bg-zinc-50/90 dark:bg-zinc-900/70 dark:hover:bg-zinc-900/70">
                  <TableHead className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Name
                  </TableHead>
                  <TableHead className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Unit
                  </TableHead>
                  <TableHead className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Added
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingResidents ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="px-4 py-10 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      Loading residents...
                    </TableCell>
                  </TableRow>
                ) : hasResidents ? (
                  residents.map((r) => (
                    <TableRow
                      key={r.id}
                      className="border-zinc-100 dark:border-zinc-800/80"
                    >
                      <TableCell className="px-4 py-3 font-medium text-foreground">
                        {r.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                        {r.unit}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            r.status === "Active"
                              ? "border-emerald-500/25 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                              : "border-amber-500/25 bg-amber-500/15 text-amber-900 dark:text-amber-200"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {r.added}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="px-4 py-10 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      No approved users yet. Submit a registration request to get
                      started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </section>

        <div className="mt-auto pt-2">
          <Button
            size="lg"
            className="h-12 w-full rounded-full text-base cursor-pointer shadow-md shadow-zinc-900/10 transition-all hover:scale-[1.01] hover:bg-amber-500"
            onClick={() => {
              setRequestSubmittedMessage("");
              setIsRegisterModalOpen(true);
            }}
          >
            Register
          </Button>
          {requestSubmittedMessage ? (
            <p className="mt-2 text-center text-sm text-emerald-700 dark:text-emerald-400">
              {requestSubmittedMessage}
            </p>
          ) : null}
        </div>
      </main>

      <footer className="border-t border-zinc-200/80 bg-gradient-to-b from-white/90 to-zinc-50/70 dark:border-zinc-800 dark:from-zinc-900/50 dark:to-zinc-950/80">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <div className="grid gap-4 text-sm sm:grid-cols-3">
            <Card className="border-zinc-200/80 bg-white/85 py-0 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
              <CardContent className="space-y-2 p-4">
                <p className="font-medium text-foreground">Abella Home WiFi</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Apartment network registration and resident management.
                </p>
              </CardContent>
            </Card>
            <Card className="border-zinc-200/80 bg-white/85 py-0 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
              <CardContent className="space-y-2 p-4">
                <p className="font-medium text-foreground">Contacts</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Admin Desk: +63 912 345 6789
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Email: AbellaHome@gmail.com
                </p>
              </CardContent>
            </Card>
            <Card className="border-zinc-200/80 bg-white/85 py-0 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
              <CardContent className="space-y-2 p-4">
                <p className="font-medium text-foreground">Quick info</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Office hours: 8:00 AM - 6:00 PM
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Response time: within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 border-t border-zinc-200/80 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Abella Home Apartment WiFi. All
                rights reserved.
              </p>
              <Button asChild size="sm" variant="outline" className="w-fit rounded-full border-zinc-300 bg-amber-500 px-3 text-xs text-white hover:bg-amber-600 hover:text-white">
                <Link href="/admin">Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>

      <RegisterResidentModal
        open={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterSubmit}
      />
    </div>
  );
}
