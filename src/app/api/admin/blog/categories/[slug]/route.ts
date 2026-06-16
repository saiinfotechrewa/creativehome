import { blogCategoriesAdminApi } from "@/lib/admin/blog";

export const dynamic = "force-dynamic";

export const GET = blogCategoriesAdminApi.getBySlug;
export const PUT = blogCategoriesAdminApi.update;
export const DELETE = blogCategoriesAdminApi.remove;
