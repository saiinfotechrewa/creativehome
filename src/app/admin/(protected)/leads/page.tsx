import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { LeadsManager } from "@/components/admin/leads/leads-manager";

export const dynamic = "force-dynamic";

/** Admin Leads Manager. Requires `leads:view`; mutations require `leads:manage`. */
export default async function LeadsPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.LEADS_VIEW)) notFound();

  return <LeadsManager />;
}
