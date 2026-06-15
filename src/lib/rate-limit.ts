/**
 * Tiny in-memory fixed-window rate limiter.
 *
 * Suitable for a single-instance deployment (the default Coolify/Docker setup).
 * For multi-instance / serverless deployments swap the Map for Redis or Upstash
 * — the `rateLimit` signature can stay the same.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  /** Unix ms timestamp when the window resets. */
  resetAt: number;
}

/**
 * @param key       unique identifier for the caller (e.g. `login:<ip>`)
 * @param limit     max requests allowed per window
 * @param windowMs  window length in milliseconds
 */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, limit, resetAt };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    success: existing.count <= limit,
    remaining,
    limit,
    resetAt: existing.resetAt,
  };
}

/** Clear a key early (e.g. after a successful login). */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

// Opportunistic cleanup so the Map doesn't grow unbounded.
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, 5 * 60_000);
  // Don't keep the Node process alive just for cleanup.
  if (typeof timer.unref === "function") timer.unref();
}
