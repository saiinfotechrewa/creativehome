import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS, resolvePermissions } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import {
  ok,
  fail,
  paginated,
  pageMeta,
  parseJson,
  parseQuery,
} from "@/lib/api-response";
import {
  paginationSchema,
  teamInviteSchema,
  teamUpdateSchema,
  activityLogQuerySchema,
} from "@/lib/validators";
import { sendEmail } from "@/lib/services/email.service";

/**
 * Team management: list / invite / update / deactivate admin users, plus the
 * activity-log feed. Passwords are never returned. Inviting without a password
 * generates a temporary one and (best-effort) emails the new member a sign-in
 * link.
 */

type IdCtx = { params: Promise<{ id: string }> };

const SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  isActive: true,
  lastLogin: true,
  permissions: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AdminUserSelect;

// ──────────────────────────────── List ───────────────────────────────────────

const list = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.USERS_VIEW);
  const q = parseQuery(req, paginationSchema);

  const where: Prisma.AdminUserWhereInput = {};
  if (q.search) {
    where.OR = [
      { name: { contains: q.search, mode: "insensitive" } },
      { email: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const sortField = ["name", "createdAt", "lastLogin", "role"].includes(
    q.sort ?? "",
  )
    ? (q.sort as string)
    : "createdAt";

  const [items, total] = await Promise.all([
    prisma.adminUser.findMany({
      where,
      orderBy: { [sortField]: q.order },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      select: SAFE_SELECT,
    }),
    prisma.adminUser.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

// ─────────────────────────────── Invite ──────────────────────────────────────

const invite = withAuthHandler(async (req: Request) => {
  const actor = await requirePermission(PERMISSIONS.USERS_MANAGE);
  const data = await parseJson(req, teamInviteSchema);

  const clash = await prisma.adminUser.findUnique({
    where: { email: data.email },
  });
  if (clash) return fail("A user with this email already exists", 409);

  // Use the supplied password, or generate a temporary one for the invite.
  const tempPassword = data.password ?? crypto.randomBytes(9).toString("base64url");
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  // Permissions = role defaults ∪ any explicit extra grants.
  const permissions = resolvePermissions(data.role, data.permissions);

  const user = await prisma.adminUser.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: data.role,
      permissions: permissions as unknown as Prisma.InputJsonValue,
      isActive: true,
    },
    select: SAFE_SELECT,
  });

  // Best-effort invite email (only when no password was set by the admin).
  let emailed = false;
  if (!data.password) {
    const loginUrl = `${process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/login`;
    const result = await sendEmail({
      to: data.email,
      subject: "You've been invited to the CreativeDox admin",
      html: `<div style="font-family:system-ui,Arial,sans-serif;line-height:1.6">
        <h2>Welcome, ${data.name}</h2>
        <p>An account has been created for you on the CreativeDox admin panel.</p>
        <p><b>Email:</b> ${data.email}<br/>
        <b>Temporary password:</b> <code>${tempPassword}</code></p>
        <p>Please sign in and change your password right away.</p>
        <p><a href="${loginUrl}">${loginUrl}</a></p>
      </div>`,
    });
    emailed = result.success;
  }

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: "create",
    module: "users",
    entityId: user.id,
    entityName: user.name,
    details: { role: user.role, invited: !data.password, emailed },
    ipAddress: getClientIp(req),
  });

  return ok(
    {
      user,
      // Surface the temp password to the inviter only when we couldn't email it.
      tempPassword: !data.password && !emailed ? tempPassword : undefined,
    },
    { status: 201 },
  );
});

// ─────────────────────────────── Update ──────────────────────────────────────

const update = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const actor = await requirePermission(PERMISSIONS.USERS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) return fail("User not found", 404);

  const data = await parseJson(req, teamUpdateSchema);

  // Guard rails: don't let an admin lock themselves out or demote the last
  // SUPERADMIN.
  if (id === actor.id && data.isActive === false) {
    return fail("You cannot deactivate your own account", 422);
  }
  if (
    existing.role === "SUPERADMIN" &&
    data.role &&
    data.role !== "SUPERADMIN"
  ) {
    const superadmins = await prisma.adminUser.count({
      where: { role: "SUPERADMIN", isActive: true },
    });
    if (superadmins <= 1) {
      return fail("At least one active SUPERADMIN must remain", 422);
    }
  }

  const patch: Prisma.AdminUserUpdateInput = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.isActive !== undefined) patch.isActive = data.isActive;
  if (data.avatar !== undefined) patch.avatar = data.avatar || null;
  if (data.role !== undefined) patch.role = data.role;

  // Recompute the effective permission set when role and/or grants change.
  if (data.role !== undefined || data.permissions !== undefined) {
    const role = data.role ?? existing.role;
    const extra =
      data.permissions ??
      (Array.isArray(existing.permissions)
        ? (existing.permissions as string[])
        : []);
    patch.permissions = resolvePermissions(
      role,
      extra,
    ) as unknown as Prisma.InputJsonValue;
  }

  const user = await prisma.adminUser.update({
    where: { id },
    data: patch,
    select: SAFE_SELECT,
  });

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: "update",
    module: "users",
    entityId: user.id,
    entityName: user.name,
    details: { role: user.role, isActive: user.isActive },
    ipAddress: getClientIp(req),
  });

  return ok(user);
});

// ───────────────────────────── Deactivate ────────────────────────────────────

const deactivate = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const actor = await requirePermission(PERMISSIONS.USERS_MANAGE);
  const { id } = await ctx.params;

  if (id === actor.id) {
    return fail("You cannot deactivate your own account", 422);
  }

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) return fail("User not found", 404);

  if (existing.role === "SUPERADMIN") {
    const superadmins = await prisma.adminUser.count({
      where: { role: "SUPERADMIN", isActive: true },
    });
    if (superadmins <= 1) {
      return fail("At least one active SUPERADMIN must remain", 422);
    }
  }

  if (!existing.isActive) return ok({ id, isActive: false });

  const user = await prisma.adminUser.update({
    where: { id },
    data: { isActive: false },
    select: SAFE_SELECT,
  });

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: "update",
    module: "users",
    entityId: user.id,
    entityName: user.name,
    details: { deactivated: true },
    ipAddress: getClientIp(req),
  });

  return ok(user);
});

// ──────────────────────────── Activity logs ──────────────────────────────────

const activity = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.ACTIVITY_VIEW);
  const q = parseQuery(req, activityLogQuerySchema);

  const where: Prisma.ActivityLogWhereInput = {};
  if (q.module) where.module = q.module;
  if (q.action) where.action = q.action;
  if (q.userId) where.userId = q.userId;
  if (q.dateFrom || q.dateTo) {
    where.createdAt = {};
    if (q.dateFrom) where.createdAt.gte = q.dateFrom;
    if (q.dateTo) where.createdAt.lte = q.dateTo;
  }
  if (q.search) {
    where.OR = [
      { entityName: { contains: q.search, mode: "insensitive" } },
      { userName: { contains: q.search, mode: "insensitive" } },
      { action: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: q.order },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      include: { user: { select: { id: true, name: true, avatar: true } } },
    }),
    prisma.activityLog.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

export const teamAdminApi = { list, invite, update, deactivate, activity };
