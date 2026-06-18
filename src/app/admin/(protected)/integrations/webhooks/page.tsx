import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { WebhooksManager } from "@/components/admin/integrations/webhooks-manager";

export const dynamic = "force-dynamic";

export default async function WebhooksPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.INTEGRATIONS_MANAGE)) notFound();
  return <WebhooksManager />;
}
