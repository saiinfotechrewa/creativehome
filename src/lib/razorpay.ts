import crypto from "node:crypto";
import Razorpay from "razorpay";

import { getRazorpayCreds, type RazorpayCreds } from "@/lib/integrations";

/**
 * Razorpay helpers: order creation, refunds, and the two HMAC-SHA256
 * verifications (client checkout callback + server webhook). All signature
 * checks use a constant-time compare to avoid timing leaks.
 *
 * Credentials resolve from the encrypted IntegrationSetting first, then env —
 * see {@link getRazorpayCreds}. Mutating calls throw `RazorpayNotConfigured`
 * when nothing is set up, which routes surface as a 503.
 */

export class RazorpayNotConfigured extends Error {
  constructor() {
    super("Razorpay is not configured");
    this.name = "RazorpayNotConfigured";
  }
}

interface RazorpayHandle {
  client: Razorpay;
  creds: RazorpayCreds;
}

async function getClient(): Promise<RazorpayHandle> {
  const creds = await getRazorpayCreds();
  if (!creds) throw new RazorpayNotConfigured();
  return {
    client: new Razorpay({ key_id: creds.keyId, key_secret: creds.keySecret }),
    creds,
  };
}

/** Constant-time compare of two hex digests. */
function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length || bufA.length === 0) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export interface CreatedOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  /** Public key id the client needs to open checkout. */
  keyId: string;
}

/**
 * Create a Razorpay order. `amount` is in major units (₹); Razorpay wants the
 * smallest unit (paise), so we multiply by 100 here.
 */
export async function createRazorpayOrder(params: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<CreatedOrder> {
  const { client, creds } = await getClient();
  const order = await client.orders.create({
    amount: Math.round(params.amount * 100),
    currency: params.currency,
    receipt: params.receipt,
    notes: params.notes,
  });
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    receipt: order.receipt,
    keyId: creds.keyId,
  };
}

/** Verify the checkout callback signature: HMAC(orderId|paymentId, keySecret). */
export async function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<boolean> {
  const creds = await getRazorpayCreds();
  if (!creds) return false;
  const expected = crypto
    .createHmac("sha256", creds.keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");
  return safeEqualHex(expected, params.signature);
}

/** Verify a webhook payload signature: HMAC(rawBody, webhookSecret). */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  webhookSecret: string,
): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");
  return safeEqualHex(expected, signature);
}

export interface RefundResult {
  id: string;
  amount: number; // major units
  status: string;
}

/** Issue a refund against a captured payment. `amount` omitted = full refund. */
export async function refundPayment(params: {
  paymentId: string;
  amount?: number;
  speed?: "normal" | "optimum";
  notes?: Record<string, string>;
}): Promise<RefundResult> {
  const { client } = await getClient();
  const refund = await client.payments.refund(params.paymentId, {
    amount: params.amount ? Math.round(params.amount * 100) : undefined,
    speed: params.speed ?? "normal",
    notes: params.notes,
  } as never);
  return {
    id: refund.id,
    amount: Number(refund.amount ?? 0) / 100,
    status: String(refund.status ?? "processed"),
  };
}
