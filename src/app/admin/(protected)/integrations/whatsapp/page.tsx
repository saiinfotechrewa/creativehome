import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { WhatsappConfig } from "@/components/admin/integrations/whatsapp-config";

export const dynamic = "force-dynamic";

export default async function WhatsappPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.INTEGRATIONS_MANAGE)) notFound();
  return <WhatsappConfig />;
}
