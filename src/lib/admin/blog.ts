import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import {
  ok,
  fail,
  paginated,
  pageMeta,
  parseJson,
  parseQuery,
} from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import {
  blogPostSchema,
  blogPostUpdateSchema,
  blogPostListQuerySchema,
  blogCategorySchema,
  blogCategoryUpdateSchema,
  publicBlogListQuerySchema,
  paginationSchema,
} from "@/lib/validators";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Blog — posts + categories.
 *
 * Two pieces of automation live here so call sites never have to remember them:
 *   • readTime  — recomputed from `content` on every write (auto, never trusted
 *     from the client).
 *   • postCount — each category's count of *currently-visible* posts is kept in
 *     sync whenever a post is created, edited, moved between categories, or
 *     deleted.
 *
 * Scheduled publishing: a post is publicly visible when it is PUBLISHED, or
 * SCHEDULED with a `publishDate` that has already passed. Future-dated posts
 * stay hidden until their time comes — see {@link publishedPostWhere}.
 * ─────────────────────────────────────────────────────────────────────────
 */

const PUBLIC_RATE = { limit: 60, windowMs: 60_000 };
const WORDS_PER_MINUTE = 200;

type SlugCtx = { params: Promise<{ slug: string }> };

const CATEGORY_BRIEF = {
  select: { id: true, slug: true, name: true },
} satisfies Prisma.BlogPostInclude["category"];

/** Trim a post payload for public list responses (drops the heavy `content`). */
const POST_PUBLIC_SELECT: Prisma.BlogPostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  featuredImage: true,
  publishDate: true,
  tags: true,
  author: true,
  readTime: true,
  views: true,
  category: { select: { id: true, slug: true, name: true } },
};

// ─────────────────────────────── Helpers ────────────────────────────────────

/** Estimate reading time in whole minutes (min 1) from HTML/MDX content. */
export function calcReadTime(content: string): number {
  const text = content.replace(/<\/?[^>]+(?:>|$)/g, " "); // strip tags
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Where-clause matching posts that should be publicly visible *right now*. */
export function publishedPostWhere(
  extra: Prisma.BlogPostWhereInput = {},
): Prisma.BlogPostWhereInput {
  const now = new Date();
  return {
    AND: [
      {
        OR: [
          { status: "PUBLISHED" },
          { status: "SCHEDULED", publishDate: { lte: now } },
        ],
      },
      // A future publishDate hides the post even if its status is PUBLISHED.
      { OR: [{ publishDate: null }, { publishDate: { lte: now } }] },
      extra,
    ],
  };
}

/** Recompute `postCount` (visible posts) for each given category id. */
export async function syncCategoryPostCount(
  categoryIds: Array<string | null | undefined>,
): Promise<void> {
  const ids = [...new Set(categoryIds.filter((v): v is string => Boolean(v)))];
  await Promise.all(
    ids.map(async (id) => {
      const postCount = await prisma.blogPost.count({
        where: publishedPostWhere({ categoryId: id }),
      });
      await prisma.blogCategory
        .update({ where: { id }, data: { postCount } })
        .catch(() => {
          /* category may have been deleted in the meantime — ignore */
        });
    }),
  );
}

/** Default publishDate to now when publishing without an explicit date. */
function resolvePublishDate(
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED",
  publishDate: Date | null | undefined,
  fallback: Date | null = null,
): Date | null {
  if (status === "PUBLISHED" && !publishDate && !fallback) return new Date();
  return publishDate ?? fallback;
}

// ─────────────────────────── Posts — admin API ──────────────────────────────

const listPosts = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.BLOG_VIEW);
  const q = parseQuery(req, blogPostListQuerySchema);

  const where: Prisma.BlogPostWhereInput = {};
  if (q.status) where.status = q.status;
  if (q.categoryId) where.categoryId = q.categoryId;
  if (q.search) {
    where.OR = [
      { title: { contains: q.search, mode: "insensitive" } },
      { excerpt: { contains: q.search, mode: "insensitive" } },
      { slug: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      include: { category: CATEGORY_BRIEF },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

const createPost = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.BLOG_MANAGE);
  const data = await parseJson(req, blogPostSchema);

  if (await prisma.blogPost.findUnique({ where: { slug: data.slug } })) {
    return fail("A blog post with this slug already exists", 409);
  }
  if (data.status === "SCHEDULED" && !data.publishDate) {
    return fail("A scheduled post needs a publish date", 400);
  }
  if (data.categoryId) {
    const cat = await prisma.blogCategory.findUnique({
      where: { id: data.categoryId },
    });
    if (!cat) return fail("Selected category does not exist", 400);
  }

  const post = await prisma.blogPost.create({
    data: {
      ...data,
      readTime: calcReadTime(data.content),
      publishDate: resolvePublishDate(data.status, data.publishDate),
      views: 0,
    } as unknown as Prisma.BlogPostUncheckedCreateInput,
    include: { category: CATEGORY_BRIEF },
  });

  await syncCategoryPostCount([post.categoryId]);
  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "create",
    module: "blog",
    entityId: post.id,
    entityName: post.title,
    ipAddress: getClientIp(req),
  });

  return ok(post, { status: 201 });
});

const getPost = withAuthHandler(async (_req: Request, ctx: SlugCtx) => {
  await requirePermission(PERMISSIONS.BLOG_VIEW);
  const { slug } = await ctx.params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: CATEGORY_BRIEF },
  });
  if (!post) return fail("Blog post not found", 404);
  return ok(post);
});

const updatePost = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
  const user = await requirePermission(PERMISSIONS.BLOG_MANAGE);
  const { slug } = await ctx.params;

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (!existing) return fail("Blog post not found", 404);

  const data = await parseJson(req, blogPostUpdateSchema);

  if (data.slug && data.slug !== slug) {
    if (await prisma.blogPost.findUnique({ where: { slug: data.slug } })) {
      return fail("A blog post with this slug already exists", 409);
    }
  }
  if (data.categoryId) {
    const cat = await prisma.blogCategory.findUnique({
      where: { id: data.categoryId },
    });
    if (!cat) return fail("Selected category does not exist", 400);
  }

  const nextStatus = data.status ?? existing.status;
  if (nextStatus === "SCHEDULED" && data.publishDate === null) {
    return fail("A scheduled post needs a publish date", 400);
  }

  const patch: Prisma.BlogPostUncheckedUpdateInput = {
    ...(data as unknown as Prisma.BlogPostUncheckedUpdateInput),
  };
  if (data.content !== undefined) patch.readTime = calcReadTime(data.content);
  if (data.status !== undefined || data.publishDate !== undefined) {
    patch.publishDate = resolvePublishDate(
      nextStatus,
      data.publishDate,
      existing.publishDate,
    );
  }

  const post = await prisma.blogPost.update({
    where: { slug },
    data: patch,
    include: { category: CATEGORY_BRIEF },
  });

  await syncCategoryPostCount([existing.categoryId, post.categoryId]);
  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "blog",
    entityId: post.id,
    entityName: post.title,
    ipAddress: getClientIp(req),
  });

  return ok(post);
});

const deletePost = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
  const user = await requirePermission(PERMISSIONS.BLOG_MANAGE);
  const { slug } = await ctx.params;

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (!existing) return fail("Blog post not found", 404);

  await prisma.blogPost.delete({ where: { slug } });
  await syncCategoryPostCount([existing.categoryId]);
  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "delete",
    module: "blog",
    entityId: existing.id,
    entityName: existing.title,
    ipAddress: getClientIp(req),
  });

  return ok({ id: existing.id, slug: existing.slug });
});

export const blogPostsAdminApi = {
  list: listPosts,
  create: createPost,
  getBySlug: getPost,
  update: updatePost,
  remove: deletePost,
};

// ──────────────────────── Categories — admin API ────────────────────────────

const listCategories = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.BLOG_VIEW);
  const q = parseQuery(req, paginationSchema);

  const where: Prisma.BlogCategoryWhereInput = {};
  if (q.search) {
    where.OR = [
      { name: { contains: q.search, mode: "insensitive" } },
      { slug: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.blogCategory.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
    }),
    prisma.blogCategory.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

const createCategory = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.BLOG_MANAGE);
  const data = await parseJson(req, blogCategorySchema);

  if (await prisma.blogCategory.findUnique({ where: { slug: data.slug } })) {
    return fail("A category with this slug already exists", 409);
  }

  const category = await prisma.blogCategory.create({
    data: { ...data, postCount: 0 },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "create",
    module: "blogCategories",
    entityId: category.id,
    entityName: category.name,
    ipAddress: getClientIp(req),
  });

  return ok(category, { status: 201 });
});

const getCategory = withAuthHandler(async (_req: Request, ctx: SlugCtx) => {
  await requirePermission(PERMISSIONS.BLOG_VIEW);
  const { slug } = await ctx.params;

  const category = await prisma.blogCategory.findUnique({ where: { slug } });
  if (!category) return fail("Category not found", 404);
  return ok(category);
});

const updateCategory = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
  const user = await requirePermission(PERMISSIONS.BLOG_MANAGE);
  const { slug } = await ctx.params;

  const existing = await prisma.blogCategory.findUnique({ where: { slug } });
  if (!existing) return fail("Category not found", 404);

  const data = await parseJson(req, blogCategoryUpdateSchema);
  if (data.slug && data.slug !== slug) {
    if (await prisma.blogCategory.findUnique({ where: { slug: data.slug } })) {
      return fail("A category with this slug already exists", 409);
    }
  }

  const category = await prisma.blogCategory.update({
    where: { slug },
    data,
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "blogCategories",
    entityId: category.id,
    entityName: category.name,
    ipAddress: getClientIp(req),
  });

  return ok(category);
});

const deleteCategory = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
  const user = await requirePermission(PERMISSIONS.BLOG_MANAGE);
  const { slug } = await ctx.params;

  const existing = await prisma.blogCategory.findUnique({ where: { slug } });
  if (!existing) return fail("Category not found", 404);

  // Posts reference categories with onDelete: SetNull, so deleting a category
  // simply un-categorises its posts — no orphaned rows.
  await prisma.blogCategory.delete({ where: { slug } });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "delete",
    module: "blogCategories",
    entityId: existing.id,
    entityName: existing.name,
    ipAddress: getClientIp(req),
  });

  return ok({ id: existing.id, slug: existing.slug });
});

export const blogCategoriesAdminApi = {
  list: listCategories,
  create: createCategory,
  getBySlug: getCategory,
  update: updateCategory,
  remove: deleteCategory,
};

// ─────────────────────────── Public blog API ────────────────────────────────

async function publicGuard(req: Request): Promise<Response | null> {
  const limit = await rateLimit(
    `public:blog:${getClientIp(req)}`,
    PUBLIC_RATE.limit,
    PUBLIC_RATE.windowMs,
  );
  return limit.success ? null : fail("Too many requests", 429);
}

const listPublicPosts = withAuthHandler(async (req: Request) => {
  const blocked = await publicGuard(req);
  if (blocked) return blocked;

  const q = parseQuery(req, publicBlogListQuerySchema);

  const extra: Prisma.BlogPostWhereInput = {};
  if (q.category) extra.category = { is: { slug: q.category } };
  if (q.tag) extra.tags = { array_contains: q.tag };
  if (q.search) {
    extra.OR = [
      { title: { contains: q.search, mode: "insensitive" } },
      { excerpt: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const where = publishedPostWhere(extra);

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishDate: "desc" },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      select: POST_PUBLIC_SELECT,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

const getPublicPost = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
  const blocked = await publicGuard(req);
  if (blocked) return blocked;

  const { slug } = await ctx.params;
  const post = await prisma.blogPost.findFirst({
    where: publishedPostWhere({ slug }),
    include: { category: CATEGORY_BRIEF },
  });
  if (!post) return fail("Not found", 404);

  // Best-effort view increment; never block the read on it.
  await prisma.blogPost
    .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  return ok({ ...post, views: post.views + 1 });
});

const listPublicCategories = withAuthHandler(async (req: Request) => {
  const blocked = await publicGuard(req);
  if (blocked) return blocked;

  const categories = await prisma.blogCategory.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      postCount: true,
    },
  });
  return ok(categories);
});

export const blogPublicApi = {
  listPosts: listPublicPosts,
  getPost: getPublicPost,
  listCategories: listPublicCategories,
};
