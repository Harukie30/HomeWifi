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
    <Card className="py-0">
      <CardHeader className="px-6 pt-6">
        <CardTitle>Rejected registrations</CardTitle>
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
              <TableHead className="pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-8 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-6 py-8 text-center text-red-600"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-6 py-8 text-center text-zinc-500"
                >
                  No rejected registrations yet.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="px-6 font-medium">{request.name}</TableCell>
                  <TableCell>{request.unit}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell>{request.phoneModel}</TableCell>
                  <TableCell>
                    {new Date(request.submittedAt).toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="pr-6">
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
      </CardContent>
    </Card>
  );
}
