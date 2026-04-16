import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-6 py-16">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-foreground dark:text-zinc-400"
        >
          ← Back to residents
        </Link>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Register a resident
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            The registration form will go here next—name, unit, and WiFi
            access details.
          </p>
        </div>
        <Button className="w-fit" disabled>
          Form coming soon
        </Button>
      </main>
    </div>
  );
}
