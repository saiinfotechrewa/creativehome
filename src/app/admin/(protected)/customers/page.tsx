import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { CustomersManager } from "@/components/admin/customers/customers-manager";

export const dynamic = "force-dynamic";

/** Admin Customers list. Requires `customers:view`. */
export default async function CustomersPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.CUSTOMERS_VIEW)) notFound();

  return <CustomersManager />;
}
