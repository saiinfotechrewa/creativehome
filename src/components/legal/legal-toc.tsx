"use client";

import Link from "next/link";
import { useActiveSection } from "@/hooks/use-active-section";
import type { LegalSection } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Sticky table of contents for legal pages. Highlights the section
 * currently in view via `useActiveSection`. Hidden on small screens.
 */
export function LegalToc({ sections }: { sections: LegalSection[] }) {
  const active = useActiveSection(sections.map((section) => section.id));

  return (
    <nav aria-label="On this page" className="space-y-1">
      <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
        On this page
      </p>
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <Link
            key={section.id}
            href={`#${section.id}`}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "border-border/60 block border-l-2 py-1.5 pl-3 text-sm transition-colors",
              isActive
                ? "border-primary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:border-muted"
            )}
          >
            {section.heading}
          </Link>
        );
      })}
    </nav>
  );
}
