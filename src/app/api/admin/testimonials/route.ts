import { testimonialsAdminApi } from "@/lib/admin/testimonials";

export const dynamic = "force-dynamic";

export const GET = testimonialsAdminApi.list;
export const POST = testimonialsAdminApi.create;
