"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { AdminLoadingDialog } from "@/components/admin/admin-loading-dialog";
import { WifiUsersTable } from "@/components/admin/wifi-users-table";
import type { Resident } from "@/lib/models";

export function WifiUsersPage() {
  const router = useRouter();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadResidents = useCallback(async () => {
    setIsLoading(true);
    setError("");
    const response = await fetch("/api/admin/residents", { cache: "no-store" });

    if (response.status === 401) {
      setIsLoading(false);
      router.push("/admin/login");
      return;
    }

    if (!response.ok) {
      setError("Failed to load WiFi users.");
      setIsLoading(false);
      return;
    }

    const payload = (await response.json()) as { residents: Resident[] };
    setResidents(payload.residents);
    setIsLoading(false);
  }, [router]);

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

  async function handleRemoveAccess(resident: Resident) {
    const ok = window.confirm(
      `Remove WiFi access for ${resident.name} (Unit ${resident.unit})?\n\nUse this when they move out. They can submit a new registration later if they return.`
    );
    if (!ok) return;

    setRemovingId(resident.id);
    try {
      const response = await fetch(
        `/api/admin/residents/${resident.id}/remove`,
        { method: "POST" }
      );

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        toast.error("Could not remove this user.");
        return;
      }

      toast.success(`${resident.name} was removed from WiFi access.`);
      await loadResidents();
    } finally {
      setRemovingId(null);
    }
  }

  useEffect(() => {
    loadResidents();
  }, [loadResidents]);

  return (
    <AdminDashboardShell title="WiFi users" onLogout={handleLogout}>
      <AdminLoadingDialog
        open={isLoading}
        title="Loading WiFi users"
        description="Fetching active residents…"
      />
      <WifiUsersTable
        residents={residents}
        isLoading={isLoading}
        error={error}
        removingId={removingId}
        onRemoveAccess={handleRemoveAccess}
      />
    </AdminDashboardShell>
  );
}
