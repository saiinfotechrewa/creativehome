import { Zap, LayoutDashboard, GitMerge, MessagesSquare } from "lucide-react";
import type { Product } from "@/lib/types";

/** Productized offerings shown in the products grid. */
export const PRODUCTS: Product[] = [
  {
    id: "flowforge",
    name: "FlowForge",
    tagline: "Automation platform",
    description:
      "Design, run, and monitor business automations across every tool your team uses — without writing code.",
    icon: Zap,
    highlights: [
      "Visual flow builder",
      "Real-time run monitoring",
      "Version-controlled workflows",
    ],
    status: "live",
    href: "/#products",
  },
  {
    id: "pulse",
    name: "Pulse",
    tagline: "Operations dashboard",
    description:
      "A single pane of glass for the metrics that run your business, updated in real time.",
    icon: LayoutDashboard,
    highlights: [
      "Composable widgets",
      "Live data sync",
      "Shareable reports",
    ],
    status: "live",
    href: "/#products",
  },
  {
    id: "bridge",
    name: "Bridge",
    tagline: "Integration hub",
    description:
      "Pre-built connectors and a robust API layer to unify your stack in days, not quarters.",
    icon: GitMerge,
    highlights: [
      "200+ connectors",
      "Webhook & event routing",
      "Schema mapping",
    ],
    status: "beta",
    href: "/#products",
  },
  {
    id: "concierge",
    name: "Concierge",
    tagline: "AI support agent",
    description:
      "An AI teammate that resolves customer questions and routes the rest to the right human instantly.",
    icon: MessagesSquare,
    highlights: [
      "Trained on your docs",
      "Omnichannel inbox",
      "Confidence-based handoff",
    ],
    status: "coming-soon",
    href: "/#products",
  },
];
