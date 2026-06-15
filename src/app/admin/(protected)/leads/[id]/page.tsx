import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { LeadDetail } from "@/components/admin/leads/lead-detail";

export const dynamic = "force-dynamic";

/** Admin lead detail. Requires `leads:view`; mutations require `leads:manage`. */
export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.LEADS_VIEW)) notFound();

  const { id } = await params;
  const canManage = can(user?.permissions, PERMISSIONS.LEADS_MANAGE);

  return <LeadDetail leadId={id} canManage={canManage} />;
}
