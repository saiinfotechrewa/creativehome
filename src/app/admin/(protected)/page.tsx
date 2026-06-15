import {
  Box,
  FileText,
  MessageSquareQuote,
  ShoppingCart,
  Users,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const cards = [
  { key: "leads", label: "Leads", icon: Users },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "products", label: "Products", icon: Box },
  { key: "posts", label: "Blog posts", icon: FileText },
  { key: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
] as const;

/**
 * Placeholder dashboard. The shell (sidebar + topbar + account menu) is
 * provided by `(protected)/layout.tsx`; this page only renders content. It is
 * rebuilt into the full widget grid in Task 4 (Dashboard V1).
 */
export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  const [leads, orders, products, posts, testimonials] = await Promise.all([
    prisma.lead.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.testimonial.count(),
  ]);

  const counts: Record<string, number> = {
    leads,
    orders,
    products,
    posts,
    testimonials,
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.name || user?.email} · {user?.role}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-xl border border-border bg-card p-5">
            <Icon className="mb-3 h-5 w-5 text-primary" />
            <div className="text-2xl font-semibold text-foreground">
              {counts[key] ?? 0}
            </div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Backend is ready. CRUD screens for each module plug into the
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5">/api/admin</code>
        routes and the Prisma models defined in
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5">
          prisma/schema.prisma
        </code>
        .
      </p>
    </div>
  );
}
