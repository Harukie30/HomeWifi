"use client";

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
import type { Resident } from "@/lib/models";

type WifiUsersTableProps = {
  residents: Resident[];
  isLoading: boolean;
  error: string;
  removingId: string | null;
  onRemoveAccess: (resident: Resident) => void;
};

export function WifiUsersTable({
  residents,
  isLoading,
  error,
  removingId,
  onRemoveAccess,
}: WifiUsersTableProps) {
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
                        className="w-full min-w-[7rem] border-red-300 text-red-700 hover:bg-red-50 sm:w-auto dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                        onClick={() => onRemoveAccess(resident)}
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
    </Card>
  );
}
