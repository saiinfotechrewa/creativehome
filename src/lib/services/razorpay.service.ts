import Razorpay from "razorpay";

import {
  createRazorpayOrder,
  verifyPaymentSignature,
  refundPayment,
  RazorpayNotConfigured,
  type CreatedOrder,
  type RefundResult,
} from "@/lib/razorpay";
import { getRazorpayCreds } from "@/lib/integrations";

/**
 * Payments service — a thin, stable facade over `@/lib/razorpay` plus
 * subscription creation (which the low-level lib doesn't cover).
 *
 * `createOrder`, `verifyPayment` and `createRefund` delegate to the existing
 * signature-verifying helpers. `createSubscription` talks to the Razorpay SDK
 * directly. Credentials resolve from the encrypted integration first, then env.
 */

/** Create a one-time payment order. `amount` is in major units (₹). */
export function createOrder(params: {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<CreatedOrder> {
  return createRazorpayOrder({
    amount: params.amount,
    currency: params.currency ?? "INR",
    receipt: params.receipt,
    notes: params.notes,
  });
}

/** Verify a Razorpay checkout callback signature. */
export function verifyPayment(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<boolean> {
  return verifyPaymentSignature(params);
}

/** Issue a full or partial refund against a captured payment. */
export function createRefund(params: {
  paymentId: string;
  amount?: number;
  speed?: "normal" | "optimum";
  notes?: Record<string, string>;
}): Promise<RefundResult> {
  return refundPayment(params);
}

export interface CreatedSubscription {
  id: string;
  status: string;
  shortUrl?: string;
  planId: string;
  customerNotify: boolean;
}

/**
 * Create a recurring subscription against an existing Razorpay plan.
 *
 * @param planId        Razorpay plan id (plan_…) created in the dashboard/API.
 * @param totalCount    Number of billing cycles to charge.
 * @param customerNotify Let Razorpay email/SMS the customer the payment link.
 * @param notes         Free-form metadata (we stash our order id here).
 */
export async function createSubscription(params: {
  planId: string;
  totalCount: number;
  customerNotify?: boolean;
  startAt?: Date;
  notes?: Record<string, string>;
}): Promise<CreatedSubscription> {
  const creds = await getRazorpayCreds();
  if (!creds) throw new RazorpayNotConfigured();

  const client = new Razorpay({
    key_id: creds.keyId,
    key_secret: creds.keySecret,
  });

  const customerNotify = params.customerNotify ?? true;
  const subscription = await client.subscriptions.create({
    plan_id: params.planId,
    total_count: params.totalCount,
    customer_notify: customerNotify ? 1 : 0,
    start_at: params.startAt
      ? Math.floor(params.startAt.getTime() / 1000)
      : undefined,
    notes: params.notes,
  } as never);

  return {
    id: subscription.id,
    status: String(subscription.status ?? "created"),
    shortUrl: (subscription as { short_url?: string }).short_url,
    planId: params.planId,
    customerNotify,
  };
}

export { RazorpayNotConfigured };

export const razorpayService = {
  createOrder,
  verifyPayment,
  createRefund,
  createSubscription,
};
