import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { OrderDetail } from "@/components/admin/orders/order-detail";

export const dynamic = "force-dynamic";

/** Admin Order detail. Requires `orders:view`; mutations require `orders:manage`. */
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.ORDERS_VIEW)) notFound();

  const canManage = can(user?.permissions, PERMISSIONS.ORDERS_MANAGE);

  return <OrderDetail orderId={id} canManage={canManage} />;
}
