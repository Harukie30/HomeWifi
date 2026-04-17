"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Spinner } from "@/components/ui/spinner";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

type AdminLoadingDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
};

export function AdminLoadingDialog({
  open,
  title = "Loading…",
  description = "Please wait a moment.",
}: AdminLoadingDialogProps) {
  const isClient = useIsClient();

  useEffect(() => {
    if (!open || !isClient) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isClient]);

  if (!isClient || !open) return null;

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px] dark:bg-black/55"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-loading-dialog-title"
        aria-busy="true"
        aria-live="polite"
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-blue-200/80 bg-white/95 px-8 py-8 text-center shadow-xl dark:border-blue-900/50 dark:bg-zinc-900/95"
      >
        <Spinner className="size-10 text-blue-600 dark:text-blue-400" />
        <div className="space-y-1">
          <p
            id="admin-loading-dialog-title"
            className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {title}
          </p>
          {description ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
