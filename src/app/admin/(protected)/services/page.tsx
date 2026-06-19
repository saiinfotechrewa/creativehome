import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { CatalogManager } from "@/components/admin/catalog/catalog-manager";

export const dynamic = "force-dynamic";

/** Admin Services. Requires `services:view`; mutations require `services:manage`. */
export default async function ServicesPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.SERVICES_VIEW)) notFound();

  const canManage = can(user?.permissions, PERMISSIONS.SERVICES_MANAGE);

  return <CatalogManager resource="services" canManage={canManage} />;
}
