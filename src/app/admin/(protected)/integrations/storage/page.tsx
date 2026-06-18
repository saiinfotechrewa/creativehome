import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { StorageConfig } from "@/components/admin/integrations/storage-config";

export const dynamic = "force-dynamic";

export default async function StoragePage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.INTEGRATIONS_MANAGE)) notFound();
  return <StorageConfig />;
}
