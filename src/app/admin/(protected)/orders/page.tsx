import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { OrdersManager } from "@/components/admin/orders/orders-manager";

export const dynamic = "force-dynamic";

/** Admin Orders list. Requires `orders:view`; mutations require `orders:manage`. */
export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.ORDERS_VIEW)) notFound();

  return <OrdersManager />;
}
