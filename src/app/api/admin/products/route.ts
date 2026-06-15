import { productsAdminApi } from "@/lib/admin/catalog-configs";

export const dynamic = "force-dynamic";

export const GET = productsAdminApi.list;
export const POST = productsAdminApi.create;
