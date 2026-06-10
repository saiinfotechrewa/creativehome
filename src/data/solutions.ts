import {
  Workflow,
  Code2,
  Plug,
  BarChart3,
  Bot,
  ShieldCheck,
} from "lucide-react";
import type { Solution } from "@/lib/types";

/** Core business solutions surfaced on the landing page. */
export const SOLUTIONS: Solution[] = [
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    description:
      "Replace manual, repetitive processes with reliable automations that run 24/7 and never drop the ball.",
    icon: Workflow,
    features: [
      "Drag-and-drop workflow builder",
      "1,000+ pre-built integrations",
      "Conditional logic & branching",
    ],
    href: "/#solutions",
  },
  {
    id: "custom-software",
    title: "Custom Software",
    description:
      "Tailor-made applications designed around your operations — not the other way around.",
    icon: Code2,
    features: [
      "Full-stack product engineering",
      "Scalable cloud architecture",
      "Dedicated delivery team",
    ],
    href: "/#solutions",
  },
  {
    id: "systems-integration",
    title: "Systems Integration",
    description:
      "Connect your CRM, ERP, and internal tools into one cohesive, real-time data fabric.",
    icon: Plug,
    features: [
      "Bi-directional sync",
      "Legacy system adapters",
      "Event-driven pipelines",
    ],
    href: "/#solutions",
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    description:
      "Turn scattered operational data into dashboards and insights your team can actually act on.",
    icon: BarChart3,
    features: [
      "Unified data warehouse",
      "Self-serve dashboards",
      "Anomaly alerts",
    ],
    href: "/#solutions",
  },
  {
    id: "ai-agents",
    title: "AI Agents",
    description:
      "Deploy AI assistants that handle support, triage, and back-office tasks with human-level context.",
    icon: Bot,
    features: [
      "Custom knowledge bases",
      "Human-in-the-loop review",
      "Multi-channel deployment",
    ],
    href: "/#solutions",
  },
  {
    id: "security-compliance",
    title: "Security & Compliance",
    description:
      "Enterprise-grade controls baked into every build — SOC 2, GDPR, and audit-ready from day one.",
    icon: ShieldCheck,
    features: [
      "Role-based access control",
      "End-to-end encryption",
      "Audit logging",
    ],
    href: "/#solutions",
  },
];
