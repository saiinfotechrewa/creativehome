import type { LeadStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requirePermission, withAuthHandler } from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { parseQuery } from "@/lib/api-response";
import { leadExportQuerySchema, leadStatusSchema } from "@/lib/validators";

/** Parse a comma-separated `statuses` param into validated LeadStatus[]. */
function parseStatuses(raw?: string): LeadStatus[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s): s is LeadStatus => leadStatusSchema.safeParse(s).success);
}

export const dynamic = "force-dynamic";

/** Quote a CSV field, escaping embedded quotes; guards against CSV injection. */
function csvCell(value: unknown): string {
  let s = value == null ? "" : String(value);
  // Neutralise spreadsheet formula injection (=, +, -, @ leading chars).
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

const COLUMNS = [
  "id",
  "name",
  "email",
  "phone",
  "whatsapp",
  "businessName",
  "businessType",
  "source",
  "status",
  "priority",
  "assignedTo",
  "createdAt",
] as const;

/**
 * GET /api/admin/leads/export — download the (filtered) leads as CSV.
 * Honours the same filters as the inbox; no pagination — exports the full set.
 */
export const GET = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.LEADS_VIEW);
  const q = parseQuery(req, leadExportQuerySchema);

  const where: Prisma.LeadWhereInput = {};
  const statuses = parseStatuses(q.statuses);
  if (statuses.length) where.status = { in: statuses };
  else if (q.status) where.status = q.status;
  if (q.source) where.source = q.source;
  if (q.priority) where.priority = q.priority;
  if (q.businessType)
    where.businessType = { contains: q.businessType, mode: "insensitive" };
  if (q.assignedTo)
    where.assignedTo = q.assignedTo === "unassigned" ? null : q.assignedTo;
  if (q.dateFrom || q.dateTo) {
    where.createdAt = {};
    if (q.dateFrom) where.createdAt.gte = q.dateFrom;
    if (q.dateTo) where.createdAt.lte = q.dateTo;
  }
  if (q.search) {
    where.OR = [
      { name: { contains: q.search, mode: "insensitive" } },
      { email: { contains: q.search, mode: "insensitive" } },
      { phone: { contains: q.search, mode: "insensitive" } },
      { businessName: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10_000, // hard cap so an export can't run away
  });

  const header = COLUMNS.join(",");
  const rows = leads.map((lead) =>
    COLUMNS.map((col) => {
      const value = lead[col as keyof typeof lead];
      return csvCell(value instanceof Date ? value.toISOString() : value);
    }).join(","),
  );
  const csv = [header, ...rows].join("\r\n");

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "export",
    module: "leads",
    details: { count: leads.length, filters: q },
    request: req,
  });

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
});
