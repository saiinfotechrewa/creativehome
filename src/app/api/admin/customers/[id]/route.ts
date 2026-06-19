import { customersAdminApi } from "@/lib/admin/customers";

export const dynamic = "force-dynamic";

export const GET = customersAdminApi.getById;
export const PUT = customersAdminApi.update;
