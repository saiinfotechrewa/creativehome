import type { AdminRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

/**
 * Module augmentation so `role` and `permissions` are typed on the session and
 * JWT everywhere they're used.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AdminRole;
      permissions: string[];
    } & DefaultSession["user"];
  }

  interface User {
    role: AdminRole;
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AdminRole;
    permissions: string[];
  }
}
