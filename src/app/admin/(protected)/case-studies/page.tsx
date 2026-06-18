import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { CaseStudiesManager } from "@/components/admin/case-studies/case-studies-manager";

export const dynamic = "force-dynamic";

/** Admin Case Studies list. Read + write are both gated on `caseStudies:manage`. */
export default async function CaseStudiesPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.CASE_STUDIES_MANAGE)) notFound();

  return <CaseStudiesManager canManage />;
}
