"use client";

import type { ReactNode } from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { getQueryClient } from "@/lib/admin/query-client";

interface ProvidersProps {
  children: ReactNode;
  /** Server-resolved session, used to seed SessionProvider (avoids a refetch). */
  session: Session | null;
}

/**
 * Client provider stack shared by the whole `/admin` area (login + protected).
 *
 * Wraps children in:
 *  - NextAuth SessionProvider (so client components can `useSession`)
 *  - React Query (admin data fetching / mutations)
 *  - Sonner toaster (global notifications surface used from Task 3 onward)
 */
export function Providers({ children, session }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="dark"
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
