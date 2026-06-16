import { blogPostsAdminApi } from "@/lib/admin/blog";

export const dynamic = "force-dynamic";

export const GET = blogPostsAdminApi.getBySlug;
export const PUT = blogPostsAdminApi.update;
export const DELETE = blogPostsAdminApi.remove;
