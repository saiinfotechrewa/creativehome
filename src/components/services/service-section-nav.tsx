"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

/** Section anchors shown in the sticky in-page nav, in document order. */
const SECTIONS = [
  { id: "deliverables", label: "What We Build" },
  { id: "process", label: "Process" },
  { id: "technologies", label: "Technologies" },
  { id: "case-study", label: "Case Study" },
  { id: "pricing", label: "Pricing" },
] as const;

const SECTION_IDS = SECTIONS.map((section) => section.id);

/**
 * Sticky in-page navigation for service detail pages. Sits directly under
 * the fixed navbar and highlights the section currently in view via
 * `useActiveSection`. Hidden on small screens, where the page reads as a
 * single scroll.
 */
export function ServiceSectionNav() {
  // Offset = navbar (64px) + this bar (~50px) so the active link flips as a
  // section reaches the bottom edge of the sticky header stack.
  const active = useActiveSection(SECTION_IDS, 130);

  return (
    <div className="border-border/60 bg-background/80 sticky top-16 z-30 hidden border-b backdrop-blur md:block">
      <Container>
        <nav
          aria-label="On this page"
          className="flex items-center gap-1 overflow-x-auto py-3"
        >
          {SECTIONS.map((section) => {
            const isActive = active === section.id;
            return (
              <Link
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-card text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
