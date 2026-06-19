import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { CatalogManager } from "@/components/admin/catalog/catalog-manager";

export const dynamic = "force-dynamic";

/** Admin Industries. Requires `industries:view`; mutations require `industries:manage`. */
export default async function IndustriesPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.INDUSTRIES_VIEW)) notFound();

  const canManage = can(user?.permissions, PERMISSIONS.INDUSTRIES_MANAGE);

  return <CatalogManager resource="industries" canManage={canManage} />;
}
