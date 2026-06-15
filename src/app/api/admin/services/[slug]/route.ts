import { servicesAdminApi } from "@/lib/admin/catalog-configs";

export const dynamic = "force-dynamic";

export const GET = servicesAdminApi.getBySlug;
export const PUT = servicesAdminApi.update;
export const DELETE = servicesAdminApi.remove;
