import { NextResponse } from "next/server";
import type { AdminRole } from "@prisma/client";

import { auth } from "@/auth";
import { can, type Permission } from "@/lib/permissions";
import { ValidationError } from "@/lib/api-response";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: AdminRole;
  permissions: string[];
}

/** Thrown by the `require*` guards; carries an HTTP status. */
export class AuthError extends Error {
  constructor(
    message: string,
    public status: number = 401,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/** Return the current session user, or null if not signed in. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  return (session?.user as SessionUser) ?? null;
}

/** Return the user or throw AuthError(401). Use in API routes / server actions. */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  return user;
}

/** Require a specific permission; throws AuthError(403) if missing. */
export async function requirePermission(
  permission: Permission,
): Promise<SessionUser> {
  const user = await requireAuth();
  if (!can(user.permissions, permission)) {
    throw new AuthError("You do not have permission to do this", 403);
  }
  return user;
}

/** Require one of the given roles; throws AuthError(403) if not matched. */
export async function requireRole(
  ...roles: AdminRole[]
): Promise<SessionUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new AuthError("Insufficient role", 403);
  }
  return user;
}

/** True/false convenience check (no throw). */
export async function hasPermission(
  permission: Permission,
): Promise<boolean> {
  const user = await getCurrentUser();
  return can(user?.permissions, permission);
}

/**
 * Wrap an API route handler so AuthError is turned into a proper JSON response
 * instead of an unhandled 500.
 *
 *   export const GET = withAuthHandler(async (req) => { ... });
 */
export function withAuthHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<Response> | Response,
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof AuthError) {
        return NextResponse.json(
          { error: err.message },
          { status: err.status },
        );
      }
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: err.message, issues: err.issues },
          { status: 400 },
        );
      }
      console.error("Unhandled API error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

/** Best-effort client IP from request headers (proxy-aware). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
