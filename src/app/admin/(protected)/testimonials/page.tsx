import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { TestimonialsManager } from "@/components/admin/testimonials/testimonials-manager";

export const dynamic = "force-dynamic";

/** Admin Testimonials. Requires `testimonials:view`; mutations require `testimonials:manage`. */
export default async function TestimonialsPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.TESTIMONIALS_VIEW)) notFound();

  const canManage = can(user?.permissions, PERMISSIONS.TESTIMONIALS_MANAGE);

  return <TestimonialsManager canManage={canManage} />;
}
