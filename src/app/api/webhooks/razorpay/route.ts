import { NextResponse } from "next/server";

import { handleRazorpayWebhook } from "@/lib/orders";

// Razorpay needs the exact raw body to verify the HMAC signature, so this route
// must stay on the Node runtime and read the unparsed text.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/webhooks/razorpay — Razorpay event receiver.
 *
 * Verifies `x-razorpay-signature` against the configured webhook secret, then
 * dispatches payment.captured / payment.failed / refund.* / subscription.*
 * events. Always replies 200 once verified so Razorpay stops retrying — the
 * handler itself is idempotent and logs failures for follow-up.
 */
export async function POST(req: Request): Promise<NextResponse> {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const result = await handleRazorpayWebhook(rawBody, signature);
  return NextResponse.json(result.body, { status: result.status });
}
