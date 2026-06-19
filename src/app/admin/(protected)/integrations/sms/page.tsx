import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { SmsConfig } from "@/components/admin/integrations/sms-config";

export const dynamic = "force-dynamic";

export default async function SmsPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.INTEGRATIONS_MANAGE)) notFound();
  return <SmsConfig />;
}
