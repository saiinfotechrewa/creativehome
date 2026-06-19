import { testimonialsAdminApi } from "@/lib/admin/testimonials";

export const dynamic = "force-dynamic";

export const GET = testimonialsAdminApi.getById;
export const PUT = testimonialsAdminApi.update;
export const DELETE = testimonialsAdminApi.remove;
