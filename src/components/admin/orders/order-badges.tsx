import type { OrderStatus } from "@prisma/client";

import { cn } from "@/lib/utils";
import { orderStatusMeta, paymentStatusMeta } from "@/lib/admin/orders-client";

/** Pill for an order's lifecycle status (Pending → Paid → Active …). */
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = orderStatusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        meta.badge,
      )}
    >
      {meta.label}
    </span>
  );
}

/** Pill for the payment-gateway status taken from the order's `payment` JSON. */
export function PaymentStatusBadge({ status }: { status: string | undefined }) {
  const meta = paymentStatusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
        meta.badge,
      )}
    >
      {meta.label}
    </span>
  );
}
