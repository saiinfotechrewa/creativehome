import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAuth, withAuthHandler } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

/**
 * Live counters for sidebar badges. Any authenticated admin may read them; the
 * sidebar only renders a badge next to items the user can already see, so this
 * leaks nothing sensitive (just totals).
 */
export const GET = withAuthHandler(async () => {
  await requireAuth();

  const [newLeads, pendingOrders, pendingTestimonials] = await Promise.all([
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.testimonial.count({ where: { status: "PENDING" } }),
  ]);

  return NextResponse.json({
    data: { newLeads, pendingOrders, pendingTestimonials },
  });
});
