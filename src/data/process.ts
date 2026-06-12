import type { ProcessStep } from "@/lib/types";

/** The 4-step engagement process shown in the "How It Works" timeline. */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "understand",
    step: 1,
    icon: "search",
    title: "Understand Your Business",
    description:
      "We study your current processes, pain points, and goals through a free consultation.",
    color: "text-sky-400",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    id: "design",
    step: 2,
    icon: "pen-tool",
    title: "Design the Right Solution",
    description:
      "We recommend the perfect combination of products and customizations for your needs.",
    color: "text-violet-400",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "automate",
    step: 3,
    icon: "zap",
    title: "Automate Operations",
    description:
      "We deploy, configure, and train your team so you're productive from day one.",
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "scale",
    step: 4,
    icon: "trending-up",
    title: "Scale Your Growth",
    description:
      "With data-driven insights and automation, watch your business grow faster.",
    color: "text-orange-400",
    gradient: "from-orange-500 to-amber-600",
  },
];
