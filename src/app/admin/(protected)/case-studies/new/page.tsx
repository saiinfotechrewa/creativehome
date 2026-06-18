import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { CaseStudyForm } from "@/components/admin/case-studies/case-study-form";

export const dynamic = "force-dynamic";

/** Create a new case study. Requires `caseStudies:manage`. */
export default async function NewCaseStudyPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.CASE_STUDIES_MANAGE)) notFound();

  return <CaseStudyForm />;
}
