import type { Stat } from "@/lib/types";

/**
 * Headline metrics for the social-proof strip. `value` is numeric so
 * the UI can animate 0 → value with <AnimatedCounter />.
 */
export const STATS: Stat[] = [
  {
    id: "businesses",
    value: 500,
    suffix: "+",
    label: "Businesses Served",
    description: "From single shops to multi-branch enterprises",
  },
  {
    id: "users",
    value: 50000,
    suffix: "+",
    label: "Active Users",
    description: "Logging in every day to run their work",
  },
  {
    id: "projects",
    value: 200,
    suffix: "+",
    label: "Projects Delivered",
    description: "Custom software shipped on time",
  },
  {
    id: "automations",
    value: 1000000,
    suffix: "+",
    label: "Automations Running",
    description: "Messages, invoices & tasks on autopilot",
  },
];
