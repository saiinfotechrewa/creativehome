import { cn } from "@/lib/utils";

type MockVariant = "dashboard" | "list" | "chart";

interface BrowserMockupProps {
  /** Address bar URL text. */
  url: string;
  /** Tailwind gradient stops tinting the screen area. */
  gradient: string;
  /** Which abstract screen layout to draw. */
  variant?: MockVariant;
  className?: string;
}

/**
 * Browser-chrome frame with an abstract dashboard placeholder —
 * the same mockup language as the homepage product carousel.
 * Swap in real screenshots later without changing the layout.
 */
export function BrowserMockup({
  url,
  gradient,
  variant = "dashboard",
  className,
}: BrowserMockupProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[#1e1e22] bg-[#0a0a0d] shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="text-muted ml-3 truncate rounded-md bg-white/5 px-2.5 py-0.5 text-[10px]">
          {url}
        </span>
      </div>

      {/* Screen */}
      <div className="relative aspect-[16/10]">
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 bg-linear-to-br opacity-25",
            gradient
          )}
        />
        <MockScreen variant={variant} />
      </div>
    </div>
  );
}

/** Abstract screen layouts — stat chips, charts, tables, list rows. */
function MockScreen({ variant }: { variant: MockVariant }) {
  if (variant === "list") {
    return (
      <div aria-hidden className="relative flex h-full flex-col gap-2 p-5">
        <div className="h-2.5 w-24 rounded-full bg-white/30" />
        <div className="mt-1 space-y-2">
          {[72, 60, 84, 52, 68, 76].map((width, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.05] p-2.5"
            >
              <div className="h-6 w-6 shrink-0 rounded-full bg-white/20" />
              <div className="flex-1 space-y-1.5">
                <div
                  className="h-1.5 rounded-full bg-white/30"
                  style={{ width: `${width}%` }}
                />
                <div className="h-1.5 w-1/3 rounded-full bg-white/15" />
              </div>
              <div className="h-4 w-12 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div aria-hidden className="relative flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-28 rounded-full bg-white/30" />
          <div className="h-5 w-20 rounded-md bg-white/10" />
        </div>
        <div className="flex flex-1 items-end gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          {[28, 46, 38, 64, 52, 78, 60, 88, 70, 94].map((height, i) => (
            <div
              key={i}
              style={{ height: `${height}%` }}
              className="flex-1 rounded-sm bg-white/30"
            />
          ))}
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 rounded-md border border-white/10 bg-white/[0.05] p-2.5"
            >
              <div className="h-1.5 w-10 rounded-full bg-white/25" />
              <div className="mt-1.5 h-2.5 w-14 rounded-full bg-white/40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden className="relative flex h-full flex-col gap-3 p-5">
      <div className="flex gap-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 rounded-md border border-white/10 bg-white/[0.06] p-2.5"
          >
            <div className="h-1.5 w-10 rounded-full bg-white/25" />
            <div className="mt-2 h-3 w-14 rounded-full bg-white/40" />
          </div>
        ))}
      </div>
      <div className="flex flex-1 gap-3">
        <div className="flex flex-[2] items-end gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          {[34, 58, 42, 72, 50, 88, 64, 78, 56, 70].map((height, i) => (
            <div
              key={i}
              style={{ height: `${height}%` }}
              className="flex-1 rounded-sm bg-white/25"
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/30" />
              <div className="h-1.5 flex-1 rounded-full bg-white/15" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white/30" />
            <div className="h-1.5 flex-1 rounded-full bg-white/15" />
            <div className="h-1.5 w-10 rounded-full bg-white/25" />
          </div>
        ))}
      </div>
    </div>
  );
}
