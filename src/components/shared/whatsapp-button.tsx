"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";

/** Pre-filled enquiry message. */
const WHATSAPP_MESSAGE = "Hi, I'm interested in your solutions. Can you help?";

/**
 * Resolve a WhatsApp link from the admin-entered value, which may be a full
 * `https://wa.me/…` URL or a plain phone number. Falls back to the constant.
 */
function whatsappHref(phone?: string): string {
  const raw = phone?.trim() || SOCIAL_LINKS.whatsapp;
  const base = raw.startsWith("http")
    ? raw
    : `https://wa.me/${raw.replace(/[^\d]/g, "")}`;
  return `${base}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

/** How close to the bottom (px) before the button hides near the footer. */
const FOOTER_THRESHOLD = 320;

/**
 * Floating WhatsApp chat button, fixed bottom-right on every page.
 * Bounces in 2s after load, pulses a soft ring continuously, shows a
 * "Chat with us" tooltip on hover, and tucks away over the footer.
 */
export function WhatsAppButton({ phone }: { phone?: string }) {
  const [ready, setReady] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const href = whatsappHref(phone);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setNearFooter(
        window.scrollY + window.innerHeight >=
          doc.scrollHeight - FOOTER_THRESHOLD
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const visible = ready && !nearFooter;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 15 }}
      className="fixed right-5 bottom-5 z-40 sm:right-6 sm:bottom-6"
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Chat with us on WhatsApp"
        className="group relative grid h-12 w-12 place-items-center rounded-full bg-[#25d366] text-white shadow-lg shadow-[#25d366]/30 transition-all duration-300 hover:scale-110 hover:shadow-[#25d366]/50 sm:h-14 sm:w-14"
      >
        {/* Expanding pulse ring */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-[#25d366]/50 [animation-duration:2.5s] motion-safe:animate-ping"
        />
        <MessageCircle className="h-6 w-6 fill-current" />

        {/* Tooltip */}
        <span className="border-border bg-card text-foreground pointer-events-none absolute top-1/2 right-full mr-3 translate-x-1 -translate-y-1/2 rounded-md border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
          Chat with us
        </span>
      </a>
    </motion.div>
  );
}
