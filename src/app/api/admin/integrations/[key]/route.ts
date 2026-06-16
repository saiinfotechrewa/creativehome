import { integrationsAdminApi } from "@/lib/admin/integrations";

export const dynamic = "force-dynamic";

export const GET = integrationsAdminApi.getByKey;
export const PUT = integrationsAdminApi.update;
