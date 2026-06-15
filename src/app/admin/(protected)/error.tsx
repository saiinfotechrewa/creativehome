"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Error boundary for protected admin routes. Must be a client component.
 * Logs to the console (swap for your monitoring service later) and offers a
 * retry that re-renders the segment.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while loading this page.
        {error.digest && (
          <span className="mt-1 block font-mono text-xs opacity-60">
            Ref: {error.digest}
          </span>
        )}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:bg-accent"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
