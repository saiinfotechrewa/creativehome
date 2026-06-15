import { industriesAdminApi } from "@/lib/admin/catalog-configs";

export const dynamic = "force-dynamic";

export const GET = industriesAdminApi.getBySlug;
export const PUT = industriesAdminApi.update;
export const DELETE = industriesAdminApi.remove;
