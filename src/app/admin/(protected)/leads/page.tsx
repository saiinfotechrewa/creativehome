import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { LeadsInbox } from "@/components/admin/leads/leads-inbox";

export const dynamic = "force-dynamic";

/** Admin Leads inbox. Requires `leads:view`. */
export default async function LeadsPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.LEADS_VIEW)) notFound();

  return <LeadsInbox />;
}
