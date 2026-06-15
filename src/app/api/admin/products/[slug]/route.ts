import { productsAdminApi } from "@/lib/admin/catalog-configs";

export const dynamic = "force-dynamic";

export const GET = productsAdminApi.getBySlug;
export const PUT = productsAdminApi.update;
export const DELETE = productsAdminApi.remove;
