import { blogCategoriesAdminApi } from "@/lib/admin/blog";

export const dynamic = "force-dynamic";

export const GET = blogCategoriesAdminApi.list;
export const POST = blogCategoriesAdminApi.create;
