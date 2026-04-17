"use client";

import Image from "next/image";
import { Copy, QrCode, Wifi } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WifiAccessQrCardProps = {
  ssid: string;
  password: string;
  qrImagePath?: string;
  residentName?: string;
  unit?: string;
};

export function WifiAccessQrCard({
  ssid,
  password,
  qrImagePath,
  residentName,
  unit,
}: WifiAccessQrCardProps) {
  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied.`);
    } catch {
      toast.error(`Could not copy ${label.toLowerCase()}.`);
    }
  }

  return (
    <Card className="overflow-hidden border-emerald-200/70 bg-white/95 py-0 shadow-sm dark:border-emerald-900/45 dark:bg-zinc-900/85">
      <CardHeader className="space-y-3 border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50/80 to-transparent px-5 pb-4 pt-5 dark:border-emerald-950/40 dark:from-emerald-950/25">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="inline-flex items-center gap-2 text-lg">
            <Wifi className="size-5 text-emerald-600 dark:text-emerald-400" />
            WiFi access granted
          </CardTitle>
          <Badge
            variant="outline"
            className="border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/35 dark:text-emerald-300"
          >
            Approved
          </Badge>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {residentName ? `${residentName},` : "You"} can now connect using this
          WiFi credential.
          {unit ? ` Unit ${unit}.` : ""}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5 pt-5">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
          <div className="mx-auto rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            {qrImagePath ? (
              <Image
                src={qrImagePath}
                alt="WiFi QR code"
                width={168}
                height={168}
                className="h-[168px] w-[168px] rounded-md object-contain"
              />
            ) : (
              <div className="flex h-[168px] w-[168px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                <QrCode className="size-8" />
                <p className="text-xs">Upload WiFi QR image</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                SSID
              </p>
              <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
                {ssid}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-2 h-7"
                onClick={() => copyText("SSID", ssid)}
              >
                <Copy className="size-3.5" />
                Copy SSID
              </Button>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Password
              </p>
              <p className="mt-1 break-all font-mono text-sm text-zinc-900 dark:text-zinc-100">
                {password}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-2 h-7"
                onClick={() => copyText("Password", password)}
              >
                <Copy className="size-3.5" />
                Copy password
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
