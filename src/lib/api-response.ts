import { NextResponse } from "next/server";
import { z, ZodError, type ZodTypeAny } from "zod";

/**
 * Shared helpers for API route handlers so every route returns the same JSON
 * envelope: `{ data }` on success, `{ error, issues? }` on failure.
 */

/** 200 (or custom) success envelope. */
export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ data }, init);
}

/** Pagination metadata returned alongside list responses. */
export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Build {@link PageMeta} from the raw counts. */
export function pageMeta(
  page: number,
  pageSize: number,
  total: number,
): PageMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** List success envelope: `{ data, meta }`. */
export function paginated<T>(data: T[], meta: PageMeta): NextResponse {
  return NextResponse.json({ data, meta });
}

/** Error envelope with an HTTP status. */
export function fail(
  message: string,
  status = 400,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json({ error: message, ...extra }, { status });
}

/**
 * Thrown when a request body fails Zod validation. Caught centrally by
 * `withAuthHandler`, which turns it into a 400 with the flattened field issues.
 */
export class ValidationError extends Error {
  constructor(public readonly issues: unknown) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

/**
 * Parse and validate a JSON request body. Throws `ValidationError` on malformed
 * JSON or schema failure so the route handler stays linear.
 */
export async function parseJson<S extends ZodTypeAny>(
  req: Request,
  schema: S,
): Promise<z.infer<S>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ValidationError([{ message: "Request body must be valid JSON" }]);
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError((result.error as ZodError).flatten());
  }
  return result.data;
}

/**
 * Parse and validate the URL query string. Throws `ValidationError` on failure.
 * Repeated keys collapse to the last value (sufficient for our filter params).
 */
export function parseQuery<S extends ZodTypeAny>(
  req: Request,
  schema: S,
): z.infer<S> {
  const params: Record<string, string> = {};
  new URL(req.url).searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);
  if (!result.success) {
    throw new ValidationError((result.error as ZodError).flatten());
  }
  return result.data;
}
