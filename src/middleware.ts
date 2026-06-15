import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Edge middleware that protects the admin panel. It uses the lightweight,
 * Prisma-free `authConfig` (the Credentials provider lives in `auth.ts` and is
 * not needed here). The `authorized` callback in authConfig decides who may
 * proceed and redirects unauthenticated users to `/admin/login`.
 */
export default NextAuth(authConfig).auth;

export const config = {
  // Run on every /admin route. The /admin/login page is allowed through by the
  // `authorized` callback; everything else requires a session.
  matcher: ["/admin/:path*"],
};
