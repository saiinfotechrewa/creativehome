import { systemAdminApi } from "@/lib/admin/system";

export const dynamic = "force-dynamic";

export const GET = systemAdminApi.getMaintenance;
export const PUT = systemAdminApi.setMaintenance;
