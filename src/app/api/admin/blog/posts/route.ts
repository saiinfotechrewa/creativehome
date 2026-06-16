import { blogPostsAdminApi } from "@/lib/admin/blog";

export const dynamic = "force-dynamic";

export const GET = blogPostsAdminApi.list;
export const POST = blogPostsAdminApi.create;
