import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config.
 *
 * This file is imported by `middleware.ts`, which runs on the Edge runtime and
 * therefore CANNOT import Prisma or bcrypt (Node APIs). The Credentials
 * provider + DB lookups live in `auth.ts`. Here we only keep things that are
 * safe everywhere: page routes and the `authorized` callback used to gate
 * `/admin/*` routes from middleware.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  // Real providers are attached in `auth.ts`. Required to be present here.
  providers: [],
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    /**
     * Runs in middleware on every matched request. Returning `false` (or a
     * redirect Response) blocks access; returning `true` allows it.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isLoginPage = pathname === "/admin/login";
      const isAdminArea = pathname.startsWith("/admin");

      // Already authenticated users shouldn't see the login page.
      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return true;
      }

      // Everything else under /admin requires a session.
      if (isAdminArea) {
        return isLoggedIn; // false → redirect to signIn page
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
