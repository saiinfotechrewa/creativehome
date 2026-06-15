import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

/**
 * React Query client factory following the official Next.js App Router pattern.
 *
 * - On the server we always create a brand-new client per request so data never
 *   leaks between users.
 * - In the browser we keep a singleton across re-renders / Fast Refresh so the
 *   cache survives client navigations.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Admin data changes often; a short stale window keeps lists fresh
        // while still de-duping bursts of requests.
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
      dehydrate: {
        // Allow pending queries to be dehydrated for streaming SSR.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** Get the request-scoped (server) or singleton (browser) QueryClient. */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
