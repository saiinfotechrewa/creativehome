import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/auth-helpers";

export type ActivityAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "export"
  | "approve"
  | "reject"
  | "status_change";

export interface LogActivityInput {
  userId?: string | null;
  userName?: string | null;
  action: ActivityAction | string;
  module: string; // products | leads | orders | settings ...
  entityId?: string | null;
  entityName?: string | null;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
  /** Pass the request to auto-extract the client IP. */
  request?: Request;
}

/**
 * Write an audit entry. Never throws — logging failures must not break the
 * action being logged, so errors are swallowed and reported to the console.
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    const ipAddress =
      input.ipAddress ??
      (input.request ? getClientIp(input.request) : undefined);

    await prisma.activityLog.create({
      data: {
        userId: input.userId ?? null,
        userName: input.userName ?? null,
        action: input.action,
        module: input.module,
        entityId: input.entityId ?? null,
        entityName: input.entityName ?? null,
        details: (input.details ?? {}) as object,
        ipAddress: ipAddress ?? null,
      },
    });
  } catch (err) {
    console.error("[activity-logger] failed to write log:", err);
  }
}

/**
 * Convenience wrapper bound to the acting user, so call sites don't repeat the
 * actor on every call.
 *
 *   const log = activityLoggerFor(user, request);
 *   await log("update", "products", { entityId, entityName });
 */
export function activityLoggerFor(
  user: { id: string; name?: string | null },
  request?: Request,
) {
  return (
    action: ActivityAction | string,
    module: string,
    extra: Partial<LogActivityInput> = {},
  ) =>
    logActivity({
      userId: user.id,
      userName: user.name ?? undefined,
      action,
      module,
      request,
      ...extra,
    });
}
