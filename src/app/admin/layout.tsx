import type { ReactNode } from "react";

import { auth } from "@/auth";
import { Providers } from "@/components/admin/providers";

/**
 * Shared layout for the entire `/admin` area — wraps BOTH the (auth) login
 * group and the (protected) app group in the client provider stack.
 *
 * It resolves the session on the server and passes it to `Providers` so the
 * client `SessionProvider` is seeded without an extra `/api/auth/session`
 * round-trip. The auth GUARD itself lives in `(protected)/layout.tsx` so the
 * login page stays public.
 *
 * Note: this renders no `<html>`/`<body>` — those come from the root layout,
 * which hides marketing chrome on `/admin/*` via `SiteFrame`.
 */
export default async function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return <Providers session={session}>{children}</Providers>;
}
