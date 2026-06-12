import { MarqueeRow } from "@/components/ui/marquee-row";

const ITEMS = [
  "Trusted by 500+ businesses",
  "10+ Products",
  "99.9% Uptime",
  "24/7 Support",
  "GST-Ready Billing",
  "WhatsApp-First Automation",
];

/** Slim scrolling trust strip between the final CTA and the footer. */
export function PreFooterStrip() {
  return (
    <aside aria-label="Highlights" className="border-border/70 border-t py-3.5">
      <MarqueeRow duration={28} gap="2.5rem">
        {ITEMS.map((item) => (
          <span
            key={item}
            className="text-muted flex items-center gap-10 text-xs font-medium tracking-wide whitespace-nowrap"
          >
            {item}
            <span aria-hidden className="text-border">
              •
            </span>
          </span>
        ))}
      </MarqueeRow>
    </aside>
  );
}
