import type { LeadStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requirePermission, withAuthHandler } from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { paginated, pageMeta, parseQuery } from "@/lib/api-response";
import { leadListQuerySchema, leadStatusSchema } from "@/lib/validators";

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

/**
 * GET /api/admin/leads — paginated, filterable, searchable leads inbox.
 * Filters: status, source, priority, assignedTo. Search spans name/email/
 * phone/businessName. Each row is augmented with the assignee's display name.
 */
export const GET = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.LEADS_VIEW);
  const q = parseQuery(req, leadListQuerySchema);

  const where: Prisma.LeadWhereInput = {};
  const statuses = parseStatuses(q.statuses);
  if (statuses.length) where.status = { in: statuses };
  else if (q.status) where.status = q.status;
  if (q.source) where.source = q.source;
  if (q.priority) where.priority = q.priority;
  if (q.businessType) {
    where.businessType = { contains: q.businessType, mode: "insensitive" };
  }
  if (q.assignedTo) {
    where.assignedTo = q.assignedTo === "unassigned" ? null : q.assignedTo;
  }
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

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  // Resolve assignee display names in one extra query.
  const assigneeIds = [
    ...new Set(leads.map((l) => l.assignedTo).filter((v): v is string => !!v)),
  ];
  const assignees = assigneeIds.length
    ? await prisma.adminUser.findMany({
        where: { id: { in: assigneeIds } },
        select: { id: true, name: true },
      })
    : [];
  const nameById = new Map(assignees.map((a) => [a.id, a.name]));

  const items = leads.map((lead) => ({
    ...lead,
    assignedToName: lead.assignedTo
      ? (nameById.get(lead.assignedTo) ?? null)
      : null,
  }));

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});
