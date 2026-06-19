import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { CatalogManager } from "@/components/admin/catalog/catalog-manager";

export const dynamic = "force-dynamic";

/** Admin Products. Requires `products:view`; mutations require `products:manage`. */
export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.PRODUCTS_VIEW)) notFound();

  const canManage = can(user?.permissions, PERMISSIONS.PRODUCTS_MANAGE);

  return <CatalogManager resource="products" canManage={canManage} />;
}
