"use client";

import { Badge } from "@/components/ui/badge";
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
import type { RegistrationRequest } from "@/lib/models";

type RejectedRegistrationsTableProps = {
  requests: RegistrationRequest[];
  isLoading: boolean;
  error: string;
};

export function RejectedRegistrationsTable({
  requests,
  isLoading,
  error,
}: RejectedRegistrationsTableProps) {
  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="px-4 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-lg sm:text-xl">Rejected registrations</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 sm:px-6">Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Phone Model</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="pr-4 sm:pr-6">Status</TableHead>
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
                    <TableCell className="pr-4 sm:pr-6">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-4 py-8 text-center text-red-600 sm:px-6"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-4 py-8 text-center text-zinc-500 sm:px-6"
                  >
                    No rejected registrations yet.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="max-w-[140px] px-4 font-medium sm:max-w-none sm:px-6">
                      <span className="line-clamp-2 sm:line-clamp-none">
                        {request.name}
                      </span>
                    </TableCell>
                    <TableCell>{request.unit}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.phoneModel}</TableCell>
                    <TableCell>
                      {new Date(request.submittedAt).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className="pr-4 sm:pr-6">
                      <Badge
                        variant="outline"
                        className="border-red-300 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                      >
                        Rejected
                      </Badge>
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
