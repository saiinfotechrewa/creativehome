"use client";

import { Mail, Phone, MapPin, Clock, MessageCircle, type LucideIcon } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";

interface InfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  iconClass: string;
}

const ITEMS: InfoItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
    iconClass: "text-sky-400",
  },
  {
    icon: Phone,
    label: "Phone",
    value: SITE_CONFIG.phone,
    href: `tel:${SITE_CONFIG.phone.replace(/\s+/g, "")}`,
    iconClass: "text-violet-400",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us instantly",
    href: SOCIAL_LINKS.whatsapp,
    external: true,
    iconClass: "text-emerald-400",
  },
  {
    icon: MapPin,
    label: "Address",
    value: SITE_CONFIG.address,
    iconClass: "text-amber-400",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon–Sat, 10:00 AM – 7:00 PM IST",
    iconClass: "text-rose-400",
  },
];

/** Right column — direct contact channels. */
export function ContactInfo() {
  return (
    <div>
      <h2 className="text-foreground text-2xl font-semibold">
        Reach us directly
      </h2>
      <p className="text-muted-foreground mt-2 leading-relaxed">
        Prefer to skip the form? Any of these get straight to a real person.
      </p>

      <Stagger className="mt-8 space-y-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const inner = (
            <div className="border-border bg-card group hover:border-muted flex items-start gap-4 rounded-xl border p-4 transition-colors duration-300">
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] ${item.iconClass}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-muted text-xs font-medium tracking-wide uppercase">
                  {item.label}
                </p>
                <p className="text-foreground group-hover:text-primary mt-0.5 break-words transition-colors">
                  {item.value}
                </p>
              </div>
            </div>
          );

          return (
            <StaggerItem key={item.label}>
              {item.href ? (
                <a
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className="block"
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
