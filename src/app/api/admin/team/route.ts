import { teamAdminApi } from "@/lib/admin/team";

export const dynamic = "force-dynamic";

export const GET = teamAdminApi.list;
export const POST = teamAdminApi.invite;
