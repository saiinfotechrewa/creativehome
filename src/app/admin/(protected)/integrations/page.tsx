import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { IntegrationOverview } from "@/components/admin/integrations/integration-overview";

export const dynamic = "force-dynamic";

/** Integration Hub overview. Requires `integrations:manage`. */
export default async function IntegrationsPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.INTEGRATIONS_MANAGE)) notFound();

  return <IntegrationOverview />;
}
