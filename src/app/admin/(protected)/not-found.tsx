import Link from "next/link";
import { Compass } from "lucide-react";

/** 404 within the admin area — keeps the user inside the panel. */
export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Compass className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Page not found</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        The admin page you’re looking for doesn’t exist or has moved.
      </p>
      <Link
        href="/admin"
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
