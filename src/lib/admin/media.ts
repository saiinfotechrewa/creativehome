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
import { mediaListQuerySchema, mediaUpdateSchema } from "@/lib/validators";
import {
  uploadImage,
  deleteImage,
  CloudinaryNotConfigured,
} from "@/lib/services/cloudinary.service";

/**
 * Media library: a paginated/filterable list, Cloudinary-backed uploads, alt /
 * folder edits, and deletes (which also purge the asset from Cloudinary).
 *
 * The Cloudinary `public_id` is stored in `MediaFile.filename` so deletes can
 * address the remote asset; `originalName` keeps the user's filename.
 */

type IdCtx = { params: Promise<{ id: string }> };

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

// ──────────────────────────────── List ───────────────────────────────────────

const list = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.MEDIA_VIEW);
  const q = parseQuery(req, mediaListQuerySchema);

  const where: Prisma.MediaFileWhereInput = {};
  if (q.folder) where.folder = q.folder;
  if (q.mimeType) where.mimeType = { startsWith: q.mimeType };
  if (q.search) {
    where.OR = [
      { originalName: { contains: q.search, mode: "insensitive" } },
      { alt: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.mediaFile.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      include: { uploader: { select: { id: true, name: true } } },
    }),
    prisma.mediaFile.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

// ─────────────────────────────── Upload ──────────────────────────────────────

const upload = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.MEDIA_MANAGE);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Expected multipart/form-data with a 'file' field", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return fail("No file provided", 400);

  if (!ALLOWED_TYPES.has(file.type)) {
    return fail("Only image files are allowed", 415);
  }
  if (file.size > MAX_BYTES) {
    return fail("File exceeds the 5 MB limit", 413);
  }

  const folder =
    (typeof form.get("folder") === "string"
      ? (form.get("folder") as string)
      : "") || undefined;
  const alt =
    typeof form.get("alt") === "string" ? (form.get("alt") as string) : null;

  const buffer = Buffer.from(await file.arrayBuffer());

  let asset;
  try {
    asset = await uploadImage({
      data: buffer,
      mimeType: file.type,
      folder,
    });
  } catch (err) {
    if (err instanceof CloudinaryNotConfigured) {
      return fail("Media storage (Cloudinary) is not configured", 503);
    }
    console.error("[media] upload failed:", err);
    return fail("Upload failed at the storage provider", 502);
  }

  const record = await prisma.mediaFile.create({
    data: {
      filename: asset.publicId,
      originalName: file.name,
      url: asset.url,
      thumbnailUrl: asset.thumbnailUrl,
      mimeType: asset.mimeType,
      size: asset.bytes,
      dimensions: { width: asset.width, height: asset.height },
      folder: folder ?? "uploads",
      alt,
      uploadedBy: user.id,
    },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "create",
    module: "media",
    entityId: record.id,
    entityName: record.originalName,
    details: { size: record.size, folder: record.folder },
    ipAddress: getClientIp(req),
  });

  return ok(record, { status: 201 });
});

// ─────────────────────────────── Update ──────────────────────────────────────

const update = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const user = await requirePermission(PERMISSIONS.MEDIA_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.mediaFile.findUnique({ where: { id } });
  if (!existing) return fail("Media file not found", 404);

  const data = await parseJson(req, mediaUpdateSchema);

  const patch: Prisma.MediaFileUpdateInput = {};
  if (data.alt !== undefined) patch.alt = data.alt || null;
  if (data.folder !== undefined) patch.folder = data.folder;

  const record = await prisma.mediaFile.update({ where: { id }, data: patch });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "media",
    entityId: record.id,
    entityName: record.originalName,
    ipAddress: getClientIp(req),
  });

  return ok(record);
});

// ─────────────────────────────── Delete ──────────────────────────────────────

const remove = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const user = await requirePermission(PERMISSIONS.MEDIA_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.mediaFile.findUnique({ where: { id } });
  if (!existing) return fail("Media file not found", 404);

  // Best-effort remote delete; we still remove the DB row even if it fails.
  try {
    await deleteImage(existing.filename);
  } catch (err) {
    if (!(err instanceof CloudinaryNotConfigured)) {
      console.error("[media] cloudinary delete failed:", err);
    }
  }

  await prisma.mediaFile.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "delete",
    module: "media",
    entityId: id,
    entityName: existing.originalName,
    ipAddress: getClientIp(req),
  });

  return ok({ id, deleted: true });
});

export const mediaAdminApi = { list, upload, update, remove };
