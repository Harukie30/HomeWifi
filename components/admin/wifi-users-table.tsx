"use client";

import { useState } from "react";
import { WifiOff } from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Resident } from "@/lib/models";

type WifiUsersTableProps = {
  residents: Resident[];
  isLoading: boolean;
  error: string;
  removingId: string | null;
  onConfirmRemoveAccess: (resident: Resident) => Promise<void>;
};

export function WifiUsersTable({
  residents,
  isLoading,
  error,
  removingId,
  onConfirmRemoveAccess,
}: WifiUsersTableProps) {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [residentToRemove, setResidentToRemove] = useState<Resident | null>(
    null
  );

  function openRemoveDialog(resident: Resident) {
    setResidentToRemove(resident);
    setRemoveDialogOpen(true);
  }

  function closeRemoveDialog() {
    setRemoveDialogOpen(false);
    setResidentToRemove(null);
  }

  async function handleConfirmRemove() {
    if (!residentToRemove) return;
    try {
      await onConfirmRemoveAccess(residentToRemove);
      closeRemoveDialog();
    } catch {
      /* parent shows toast; keep dialog open */
    }
  }

  return (
    <Card className="overflow-hidden border-blue-200/70 bg-white/85 py-0 dark:border-blue-900/45 dark:bg-zinc-900/75">
      <CardHeader className="px-4 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-lg sm:text-xl">Active WiFi users</CardTitle>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Residents currently approved for building WiFi. Remove access when
          someone moves out so a new resident can be added.
        </p>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 sm:px-6">Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right pr-4 sm:pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, row) => (
                  <TableRow key={row}>
                    <TableCell className="px-4 sm:px-6">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="pr-4 text-right sm:pr-6">
                      <Skeleton className="ml-auto h-8 w-[7.5rem] rounded-md sm:h-7" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-4 py-8 text-center text-red-600 sm:px-6"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : residents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-4 py-8 text-center text-zinc-500 sm:px-6"
                  >
                    No active WiFi users yet. Approve registrations from Pending
                    requests.
                  </TableCell>
                </TableRow>
              ) : (
                residents.map((resident) => (
                  <TableRow key={resident.id}>
                    <TableCell className="max-w-[160px] px-4 font-medium sm:max-w-none sm:px-6">
                      <span className="line-clamp-2 sm:line-clamp-none">
                        {resident.name}
                      </span>
                    </TableCell>
                    <TableCell>{resident.unit}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                      >
                        {resident.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400">
                      {resident.added}
                    </TableCell>
                    <TableCell className="pr-4 text-right sm:pr-6">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={removingId === resident.id}
                        className="w-full min-w-[7rem] bg-red-500 text-white cursor-pointer hover:bg-red-50 sm:w-auto dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                        onClick={() => openRemoveDialog(resident)}
                      >
                        {removingId === resident.id ? "Removing…" : "Remove access"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog
        open={removeDialogOpen}
        onOpenChange={(open) => {
          setRemoveDialogOpen(open);
          if (!open) {
            setResidentToRemove(null);
          }
        }}
      >
        <AlertDialogContent
          size="default"
          className="gap-0 overflow-hidden border-blue-200/70 p-0 shadow-2xl shadow-blue-950/10 dark:border-blue-900/50 dark:shadow-black/40 sm:max-w-[440px]"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/90 to-sky-50/50 px-6 pb-5 pt-6 dark:from-zinc-950 dark:via-blue-950/35 dark:to-zinc-950">
            <div
              className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-red-400/15 blur-3xl dark:bg-red-500/10"
              aria-hidden
            />
            <div className="relative flex gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-200/70 bg-white shadow-sm dark:border-red-900/50 dark:bg-red-950/40"
                aria-hidden
              >
                <WifiOff className="size-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
                <AlertDialogTitle className="text-balance text-left text-lg font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50">
                  Remove WiFi access
                </AlertDialogTitle>
                <p className="text-left text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Revoke this resident from your active building WiFi list. They
                  will no longer appear as an approved user in this dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-100/90 bg-white px-6 py-5 dark:border-blue-950/40 dark:bg-zinc-950">
            <div className="rounded-xl border border-zinc-200/90 bg-gradient-to-b from-zinc-50/90 to-white px-4 py-3.5 dark:border-zinc-800 dark:from-zinc-900/80 dark:to-zinc-950/90">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Resident
              </p>
              <p className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {residentToRemove?.name ?? "—"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-blue-200/80 bg-blue-50/80 font-normal text-blue-900 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-200"
                >
                  Unit {residentToRemove?.unit ?? "—"}
                </Badge>
                {residentToRemove ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 font-normal text-emerald-800 dark:text-emerald-300"
                  >
                    {residentToRemove.status}
                  </Badge>
                ) : null}
              </div>
            </div>
            <AlertDialogDescription asChild>
              <div className="mt-4 space-y-2.5 text-left text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                <p className="text-pretty">
                  Use{" "}
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    Remove access
                  </span>{" "}
                  when someone moves out or should no longer be listed — for
                  example so a new resident can be added for the same unit.
                </p>
                <p className="text-pretty">
                  They can submit a new registration later if they return to the
                  building.
                </p>
              </div>
            </AlertDialogDescription>
          </div>

          <AlertDialogFooter className="-mx-0 -mb-0 gap-2 rounded-b-xl border-t border-blue-100/90 bg-slate-50/90 px-4 py-4 dark:border-blue-950/40 dark:bg-zinc-900/70 sm:justify-end sm:gap-3 sm:px-6">
            <AlertDialogCancel
              type="button"
              className="mt-0 min-w-[5.5rem] border-zinc-200 bg-blue-500 text-white cursor-pointer hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              disabled={!!removingId}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="min-w-[8.5rem] shadow-sm cursor-pointer"
              disabled={
                !residentToRemove || removingId === residentToRemove?.id
              }
              onClick={() => void handleConfirmRemove()}
            >
              {removingId === residentToRemove?.id
                ? "Removing…"
                : "Remove access"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
