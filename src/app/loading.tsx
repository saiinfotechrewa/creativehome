/**
 * Route loading state — a pulsing logo on the page background.
 * Shown by Next.js while a route segment is being prepared.
 */
export default function Loading() {
  return (
    <div className="bg-background fixed inset-0 z-50 grid place-items-center">
      <div className="flex animate-pulse flex-col items-center gap-4">
        <span className="from-primary to-secondary grid h-14 w-14 place-items-center rounded-xl bg-linear-to-br text-xl font-bold text-white shadow-lg shadow-primary/30">
          {"{}"}
        </span>
        <span className="text-lg font-semibold tracking-tight">
          <span className="text-foreground">Creative</span>
          <span className="text-gradient">Dox</span>
        </span>
      </div>
    </div>
  );
}
