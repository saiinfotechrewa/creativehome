import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { AnalyticsConfig } from "@/components/admin/integrations/analytics-config";

export const dynamic = "force-dynamic";

export default async function AnalyticsIntegrationPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.INTEGRATIONS_MANAGE)) notFound();
  return <AnalyticsConfig />;
}
