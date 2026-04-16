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
import type { RegistrationRequest } from "@/lib/models";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";

export function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests]
  );

  async function loadRequests() {
    setIsLoading(true);
    setError("");
    const response = await fetch("/api/admin/requests", { cache: "no-store" });

    if (response.status === 401) {
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

  async function handleAction(requestId: string, action: "approve" | "reject") {
    const response = await fetch(`/api/admin/requests/${requestId}/${action}`, {
      method: "POST",
    });
    if (response.ok) {
      loadRequests();
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <AdminDashboardShell
      title="Pending Registrations"
      onLogout={handleLogout}
    >
      <Card className="py-0">
        <CardHeader className="px-6 pt-6">
          <CardTitle>Requests Queue</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Phone Model</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-8 text-center">
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-8 text-center text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : pendingRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                    No pending requests right now.
                  </TableCell>
                </TableRow>
              ) : (
                pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="px-6 font-medium">{request.name}</TableCell>
                    <TableCell>{request.unit}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.phoneModel}</TableCell>
                    <TableCell>
                      {new Date(request.submittedAt).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Pending</Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={() => handleAction(request.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
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
        </CardContent>
      </Card>
    </AdminDashboardShell>
  );
}
