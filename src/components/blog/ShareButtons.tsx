"use client";

import { Linkedin, Share2, Twitter } from "lucide-react";
import { absoluteUrl, cn } from "@/lib/utils";

interface ShareButtonsProps {
  slug: string;
  title: string;
  className?: string;
}

/** WhatsApp icon (not in lucide) as an inline SVG. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

const triggerClasses =
  "border-border bg-card text-muted-foreground inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors hover:text-foreground";

/** Share-to-social buttons for WhatsApp, LinkedIn, and X/Twitter. */
export function ShareButtons({ slug, title, className }: ShareButtonsProps) {
  const url = absoluteUrl(`/blog/${slug}`);
  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const links = [
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${text}%20${encodedUrl}`,
      icon: <WhatsAppIcon className="h-4 w-4" />,
      hover: "hover:border-[#25d366]/50 hover:bg-[#25d366]/10",
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin className="h-4 w-4" />,
      hover: "hover:border-[#0a66c2]/50 hover:bg-[#0a66c2]/10",
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      icon: <Twitter className="h-4 w-4" />,
      hover: "hover:border-sky-500/50 hover:bg-sky-500/10",
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-muted mr-1 inline-flex items-center gap-1.5 text-sm font-medium">
        <Share2 className="h-4 w-4" />
        Share
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={link.label}
          className={cn(triggerClasses, link.hover)}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
