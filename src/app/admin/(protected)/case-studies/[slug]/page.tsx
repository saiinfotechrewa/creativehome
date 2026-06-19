import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { CaseStudyEditor } from "@/components/admin/case-studies/case-study-editor";

export const dynamic = "force-dynamic";

/** Edit an existing case study. Requires `caseStudies:manage`. */
export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.CASE_STUDIES_MANAGE)) notFound();

  return <CaseStudyEditor slug={slug} />;
}
