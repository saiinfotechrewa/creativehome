import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { EmailConfig } from "@/components/admin/integrations/email-config";

export const dynamic = "force-dynamic";

export default async function EmailPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.INTEGRATIONS_MANAGE)) notFound();
  return <EmailConfig />;
}
