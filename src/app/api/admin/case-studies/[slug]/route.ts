import { caseStudiesAdminApi } from "@/lib/admin/case-studies";

export const dynamic = "force-dynamic";

export const GET = caseStudiesAdminApi.getBySlug;
export const PUT = caseStudiesAdminApi.update;
export const DELETE = caseStudiesAdminApi.remove;
