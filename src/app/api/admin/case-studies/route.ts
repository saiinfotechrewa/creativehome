import { caseStudiesAdminApi } from "@/lib/admin/case-studies";

export const dynamic = "force-dynamic";

export const GET = caseStudiesAdminApi.list;
export const POST = caseStudiesAdminApi.create;
