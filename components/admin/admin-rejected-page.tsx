"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { AdminLoadingDialog } from "@/components/admin/admin-loading-dialog";
import { RejectedRegistrationsTable } from "@/components/admin/rejected-registrations-table";
import type { RegistrationRequest } from "@/lib/models";
import { toast } from "sonner";

export function AdminRejectedPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const rejectedRequests = useMemo(
    () => requests.filter((request) => request.status === "rejected"),
    [requests]
  );

  async function loadRequests() {
    setIsLoading(true);
    setError("");
    const response = await fetch("/api/admin/requests", { cache: "no-store" });

    if (response.status === 401) {
      setIsLoading(false);
      router.push("/admin/login");
      return;
    }

    if (!response.ok) {
      setError("Failed to load registration requests.");
      setIsLoading(false);
      return;
    }

    const payload = (await response.json()) as { requests: RegistrationRequest[] };
    setRequests(payload.requests);
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
    loadRequests();
  }, []);

  return (
    <AdminDashboardShell title="Rejected users" onLogout={handleLogout}>
      <AdminLoadingDialog
        open={isLoading}
        title="Loading registrations"
        description="Fetching rejected requests…"
      />
      <RejectedRegistrationsTable
        requests={rejectedRequests}
        isLoading={isLoading}
        error={error}
      />
    </AdminDashboardShell>
  );
}
