import { getBrandIcon } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

/**
 * A circular tech-stack glyph. Renders the official Simple Icons logo for
 * known technologies; for everything else it falls back to the first
 * letter as a monogram. Either way it sits on the service gradient and is
 * drawn in white so it stays legible on the dark theme.
 */
export function BrandGlyph({
  name,
  gradient,
  className,
}: {
  name: string;
  gradient: string;
  className?: string;
}) {
  const brand = getBrandIcon(name);

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white shadow-inner",
        gradient,
        className
      )}
    >
      {brand ? (
        <svg
          viewBox="0 0 24 24"
          role="img"
          className="h-[18px] w-[18px] fill-white"
        >
          <path d={brand.path} />
        </svg>
      ) : (
        name.charAt(0)
      )}
    </span>
  );
}
