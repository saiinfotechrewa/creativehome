"use client";

import Link from "next/link";
import { ArrowRight, MessageSquareQuote } from "lucide-react";

/**
 * Testimonials aren't authored inline — they live in their own manager (with
 * approval workflow, ratings, display ordering). This editor just routes there.
 */
export function TestimonialsEditor() {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageSquareQuote className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Managed in the Testimonials manager
          </h3>
          <p className="text-sm text-muted-foreground">
            Customer testimonials shown on the homepage are created, approved and
            ordered in the dedicated Testimonials manager. Toggle this section on
            or off here; edit the content there.
          </p>
        </div>
      </div>
      <Link
        href="/admin/testimonials"
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Open Testimonials manager
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
