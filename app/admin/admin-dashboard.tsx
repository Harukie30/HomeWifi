"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PasswordRevealRequest, RegistrationRequest } from "@/lib/models";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { AdminLoadingDialog } from "@/components/admin/admin-loading-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const LOADING_DIALOG_MIN_MS = 2500;
const LOGOUT_DIALOG_MIN_MS = 2500;

export function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [passwordRevealRequests, setPasswordRevealRequests] = useState<
    PasswordRevealRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests]
  );

  async function loadRequests(options?: { silent?: boolean }) {
    const silent = options?.silent ?? false;
    const loadStartedAt = Date.now();
    if (!silent) {
      setIsLoading(true);
    }
    setError("");
    try {
      const [registrationResponse, revealResponse] = await Promise.all([
        fetch("/api/admin/requests", { cache: "no-store" }),
        fetch("/api/admin/password-reveal-requests", { cache: "no-store" }),
      ]);

      if (registrationResponse.status === 401 || revealResponse.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!registrationResponse.ok || !revealResponse.ok) {
        setError("Failed to load registration requests.");
        toast.error("Could not load requests.");
        return;
      }

      const payload = (await registrationResponse.json()) as {
        requests: RegistrationRequest[];
      };
      const revealPayload = (await revealResponse.json()) as {
        requests: PasswordRevealRequest[];
      };
      setRequests(payload.requests);
      setPasswordRevealRequests(revealPayload.requests);
    } finally {
      if (!silent) {
        const elapsedMs = Date.now() - loadStartedAt;
        const remainingMs = Math.max(0, LOADING_DIALOG_MIN_MS - elapsedMs);
        if (remainingMs > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, remainingMs));
        }
        setIsLoading(false);
      }
    }
  }

  async function handleAction(requestId: string, action: "approve" | "reject") {
    const row = pendingRequests.find((r) => r.id === requestId);
    const who = row ? `${row.name} · Unit ${row.unit}` : "This request";

    await toast.promise(
      (async () => {
        const response = await fetch(
          `/api/admin/requests/${requestId}/${action}`,
          { method: "POST" }
        );

        if (response.status === 401) {
          router.push("/admin/login");
          throw new Error("Session expired. Please sign in again.");
        }

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(
            body.error ??
              (action === "approve"
                ? "Could not approve this request."
                : "Could not reject this request.")
          );
        }

        await loadRequests({ silent: true });
      })(),
      {
        loading:
          action === "approve" ? "Approving registration…" : "Rejecting request…",
        success:
          action === "approve"
            ? `Approved — ${who} now has WiFi access.`
            : `Rejected — ${who} was not added to WiFi.`,
        error: (err) =>
          err instanceof Error ? err.message : "Something went wrong.",
      }
    );
  }

  async function handleRevealAction(
    requestId: string,
    action: "approve" | "reject"
  ) {
    const row = passwordRevealRequests.find((r) => r.id === requestId);
    const who = row ? `${row.name} · Unit ${row.unit}` : "This request";

    await toast.promise(
      (async () => {
        const response = await fetch(
          `/api/admin/password-reveal-requests/${requestId}/${action}`,
          { method: "POST" }
        );
        if (response.status === 401) {
          router.push("/admin/login");
          throw new Error("Session expired. Please sign in again.");
        }
        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(
            body.error ??
              (action === "approve"
                ? "Could not approve this password request."
                : "Could not reject this password request.")
          );
        }
        await loadRequests({ silent: true });
      })(),
      {
        loading:
          action === "approve"
            ? "Approving password-view request…"
            : "Rejecting password-view request…",
        success:
          action === "approve"
            ? `Approved — ${who} can now view WiFi password for 4 minutes.`
            : `Rejected — ${who}'s password-view request was denied.`,
        error: (err) =>
          err instanceof Error ? err.message : "Something went wrong.",
      }
    );
  }

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const logoutStartedAt = Date.now();
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (response.ok) {
      toast.success("You have been logged out.");
    } else {
      toast.error("Could not log out. Please try again.");
    }

    const elapsedMs = Date.now() - logoutStartedAt;
    const remainingMs = Math.max(0, LOGOUT_DIALOG_MIN_MS - elapsedMs);
    if (remainingMs > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, remainingMs));
    }

    router.push("/admin/login");
    router.refresh();
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <AdminDashboardShell title="Pending requests" onLogout={handleLogout}>
      <AdminLoadingDialog
        open={isLoading}
        title="Loading requests"
        description="Fetching pending registrations…"
      />
      <AdminLoadingDialog
        open={isLoggingOut}
        title="Signing out"
        description="Closing your admin session…"
      />
      <Card className="overflow-hidden py-0">
        <CardHeader className="px-4 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="text-lg sm:text-xl">Pending requests</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 sm:px-6">Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Phone Model</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4 sm:pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, row) => (
                  <TableRow key={row}>
                    <TableCell className="px-4 sm:px-6">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="pr-4 sm:pr-6">
                      <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end">
                        <Skeleton className="h-8 w-20 rounded-md sm:h-7" />
                        <Skeleton className="h-8 w-20 rounded-md sm:h-7" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-4 py-8 text-center text-red-600 sm:px-6">
                    {error}
                  </TableCell>
                </TableRow>
              ) : pendingRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-4 py-8 text-center text-zinc-500 sm:px-6">
                    No pending requests right now.
                  </TableCell>
                </TableRow>
              ) : (
                pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="max-w-[140px] px-4 font-medium sm:max-w-none sm:px-6">
                      <span className="line-clamp-2 sm:line-clamp-none">{request.name}</span>
                    </TableCell>
                    <TableCell>{request.unit}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.phoneModel}</TableCell>
                    <TableCell>
                      {new Date(request.submittedAt).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Pending</Badge>
                    </TableCell>
                    <TableCell className="pr-4 text-right sm:pr-6">
                      <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end">
                        <Button
                          size="sm"
                          className="w-full min-w-[5.5rem] bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
                          onClick={() => handleAction(request.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full min-w-[5.5rem] border-red-300 text-red-600 hover:bg-red-50 sm:w-auto"
                          onClick={() => handleAction(request.id, "reject")}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 overflow-hidden py-0">
        <CardHeader className="px-4 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="text-lg sm:text-xl">
            Password show requests
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 sm:px-6">Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-4 sm:pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, row) => (
                    <TableRow key={row}>
                      <TableCell className="px-4 sm:px-6">
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="pr-4 sm:pr-6">
                        <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end">
                          <Skeleton className="h-8 w-20 rounded-md sm:h-7" />
                          <Skeleton className="h-8 w-20 rounded-md sm:h-7" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : passwordRevealRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-4 py-8 text-center text-zinc-500 sm:px-6"
                    >
                      No pending password-view requests.
                    </TableCell>
                  </TableRow>
                ) : (
                  passwordRevealRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="max-w-[140px] px-4 font-medium sm:max-w-none sm:px-6">
                        <span className="line-clamp-2 sm:line-clamp-none">
                          {request.name}
                        </span>
                      </TableCell>
                      <TableCell>{request.unit}</TableCell>
                      <TableCell>{request.phone}</TableCell>
                      <TableCell>
                        {new Date(request.requestedAt).toLocaleString("en-US")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Pending</Badge>
                      </TableCell>
                      <TableCell className="pr-4 text-right sm:pr-6">
                        <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end">
                          <Button
                            size="sm"
                            className="w-full min-w-[5.5rem] bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
                            onClick={() =>
                              handleRevealAction(request.id, "approve")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full min-w-[5.5rem] border-red-300 text-red-600 hover:bg-red-50 sm:w-auto"
                            onClick={() =>
                              handleRevealAction(request.id, "reject")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminDashboardShell>
  );
}
