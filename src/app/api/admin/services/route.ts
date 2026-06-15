import { servicesAdminApi } from "@/lib/admin/catalog-configs";

export const dynamic = "force-dynamic";

export const GET = servicesAdminApi.list;
export const POST = servicesAdminApi.create;
