import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { CustomerDetail } from "@/components/admin/customers/customer-detail";

export const dynamic = "force-dynamic";

/** Admin Customer detail. Requires `customers:view`; edits require `customers:manage`. */
export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.CUSTOMERS_VIEW)) notFound();

  const canManage = can(user?.permissions, PERMISSIONS.CUSTOMERS_MANAGE);

  return <CustomerDetail customerId={id} canManage={canManage} />;
}
