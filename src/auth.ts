import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { AdminRole } from "@prisma/client";

import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { resolvePermissions } from "@/lib/permissions";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators";

/**
 * Node-runtime NextAuth instance: wires the Credentials provider (which needs
 * Prisma + bcrypt) onto the shared edge-safe `authConfig`. Exports the handlers
 * used by the route, plus `auth`/`signIn`/`signOut` for server components and
 * server actions.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        // 1. Validate shape
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // 2. Rate limit per email (5 attempts / 5 min)
        const limited = rateLimit(`login:${email.toLowerCase()}`, 5, 5 * 60_000);
        if (!limited.success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        // 3. Look up the user
        const user = await prisma.adminUser.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (!user || !user.isActive) return null;

        // 4. Verify password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        // 5. Success — clear the rate-limit window, stamp last login
        resetRateLimit(`login:${email.toLowerCase()}`);
        await prisma.adminUser.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        const permissions = resolvePermissions(
          user.role,
          Array.isArray(user.permissions) ? (user.permissions as string[]) : [],
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar ?? null,
          role: user.role,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /** Persist role + permissions into the JWT on sign-in. */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    /** Expose role + permissions on the session for the client/server. */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AdminRole;
        session.user.permissions = (token.permissions as string[]) ?? [];
      }
      return session;
    },
  },
});
