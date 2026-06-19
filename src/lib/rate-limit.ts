/**
 * Fixed-window rate limiter with a Redis (Upstash) backend and an in-memory
 * fallback.
 *
 * When `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set, limits are
 * enforced in Redis via the Upstash REST API (works across multiple instances /
 * serverless invocations, and is edge-compatible since it's plain `fetch` — no
 * SDK or persistent socket). Without those env vars, or if a Redis call fails,
 * it transparently falls back to a per-instance in-memory window so local dev
 * and single-instance deploys keep working.
 *
 * `rateLimit` / `resetRateLimit` are async; all callers `await` them.
 */

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  /** Unix ms timestamp when the window resets. */
  resetAt: number;
  /** Which backend served this decision (useful for diagnostics/headers). */
  backend: "redis" | "memory";
}

// ───────────────────────────── In-memory fallback ───────────────────────────

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, limit, resetAt, backend: "memory" };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    success: existing.count <= limit,
    remaining,
    limit,
    resetAt: existing.resetAt,
    backend: "memory",
  };
}

// Opportunistic cleanup so the Map doesn't grow unbounded.
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, 5 * 60_000);
  if (typeof timer.unref === "function") timer.unref();
}

// ──────────────────────────────── Redis (Upstash) ───────────────────────────

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/** True when an Upstash Redis backend is configured. */
export function isRedisRateLimitEnabled(): boolean {
  return Boolean(REDIS_URL && REDIS_TOKEN);
}

/** Run a single Upstash pipeline of commands; returns the `result` of each. */
async function upstashPipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash pipeline failed: ${res.status}`);
  const json = (await res.json()) as Array<{ result?: unknown; error?: string }>;
  return json.map((entry) => {
    if (entry?.error) throw new Error(entry.error);
    return entry?.result;
  });
}

async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  // INCR the counter, set the window TTL only on first hit (NX), read the TTL.
  const ns = `ratelimit:${key}`;
  const [countRaw, , pttlRaw] = await upstashPipeline([
    ["INCR", ns],
    ["PEXPIRE", ns, windowMs, "NX"],
    ["PTTL", ns],
  ]);

  const count = Number(countRaw) || 0;
  let pttl = Number(pttlRaw);
  // PTTL returns -1 (no expiry) / -2 (missing) in edge cases — repair the TTL.
  if (!Number.isFinite(pttl) || pttl < 0) {
    await upstashPipeline([["PEXPIRE", ns, windowMs]]);
    pttl = windowMs;
  }

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    limit,
    resetAt: Date.now() + pttl,
    backend: "redis",
  };
}

// ──────────────────────────────── Public API ────────────────────────────────

/**
 * @param key       unique identifier for the caller (e.g. `login:<ip>`)
 * @param limit     max requests allowed per window
 * @param windowMs  window length in milliseconds
 */
export async function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): Promise<RateLimitResult> {
  if (isRedisRateLimitEnabled()) {
    try {
      return await redisRateLimit(key, limit, windowMs);
    } catch (err) {
      // Never fail open on Redis errors at the cost of availability — fall back
      // to the in-memory limiter so the endpoint stays protected and reachable.
      console.error("[rate-limit] Redis backend failed, using in-memory:", err);
    }
  }
  return inMemoryRateLimit(key, limit, windowMs);
}

/** Clear a key early (e.g. after a successful login). */
export async function resetRateLimit(key: string): Promise<void> {
  buckets.delete(key);
  if (isRedisRateLimitEnabled()) {
    try {
      await upstashPipeline([["DEL", `ratelimit:${key}`]]);
    } catch (err) {
      console.error("[rate-limit] Redis reset failed:", err);
    }
  }
}
