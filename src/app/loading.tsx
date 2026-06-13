/**
 * Route loading state — a pulsing CreativeDox logo on the page background.
 * Pure CSS animation (pulse + fading ring), shown by Next.js while a route
 * segment is being prepared. Intentionally minimal.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="bg-background fixed inset-0 z-50 grid place-items-center"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative grid place-items-center">
          {/* Fading pulse ring behind the mark */}
          <span
            aria-hidden
            className="from-primary to-secondary absolute h-14 w-14 animate-ping rounded-xl bg-linear-to-br opacity-30"
          />
          {/* Logo mark — gentle breathing pulse */}
          <span className="from-primary to-secondary shadow-primary/30 relative grid h-14 w-14 animate-pulse place-items-center rounded-xl bg-linear-to-br text-xl font-bold text-white shadow-lg">
            {"{}"}
          </span>
        </div>

        <span className="animate-pulse text-lg font-semibold tracking-tight">
          <span className="text-foreground">Creative</span>
          <span className="text-gradient">Dox</span>
        </span>

        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
