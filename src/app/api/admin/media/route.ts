import { mediaAdminApi } from "@/lib/admin/media";

export const dynamic = "force-dynamic";

export const GET = mediaAdminApi.list;
export const POST = mediaAdminApi.upload;
