import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { RazorpayConfig } from "@/components/admin/integrations/razorpay-config";

export const dynamic = "force-dynamic";

export default async function RazorpayPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.INTEGRATIONS_MANAGE)) notFound();
  return <RazorpayConfig />;
}
